use tokio::sync::broadcast;
use tokio::sync::broadcast::error::{RecvError, TryRecvError};

use crate::bridge::types::BridgeNotification;

const BRIDGE_SUBSYSTEMS: [&str; 4] = ["player", "playlist", "mixer", "options"];

#[derive(Debug, PartialEq)]
pub enum IdleResult {
    Changed(Vec<String>),
    Closed,
}

pub struct IdleTracker {
    receiver: broadcast::Receiver<BridgeNotification>,
    pending: Vec<String>,
}

impl IdleTracker {
    pub fn new(receiver: broadcast::Receiver<BridgeNotification>) -> Self {
        Self {
            receiver,
            pending: Vec::new(),
        }
    }

    pub async fn wait(&mut self, filter: &[String]) -> IdleResult {
        loop {
            self.drain();

            let changed = self.take_matching(filter);
            if !changed.is_empty() {
                return IdleResult::Changed(changed);
            }

            match self.receiver.recv().await {
                Ok(notification) => self.mark_pending(notification.subsystem),
                Err(RecvError::Lagged(_)) => self.mark_all_pending(),
                Err(RecvError::Closed) => return IdleResult::Closed,
            }
        }
    }

    fn drain(&mut self) {
        loop {
            match self.receiver.try_recv() {
                Ok(notification) => self.mark_pending(notification.subsystem),
                Err(TryRecvError::Lagged(_)) => self.mark_all_pending(),
                Err(TryRecvError::Empty) => break,
                Err(TryRecvError::Closed) => break,
            }
        }
    }

    fn mark_pending(&mut self, subsystem: String) {
        if !self.pending.contains(&subsystem) {
            self.pending.push(subsystem);
        }
    }

    fn mark_all_pending(&mut self) {
        for subsystem in BRIDGE_SUBSYSTEMS {
            self.mark_pending(subsystem.to_string());
        }
    }

    fn take_matching(&mut self, filter: &[String]) -> Vec<String> {
        let (matching, rest) = std::mem::take(&mut self.pending)
            .into_iter()
            .partition(|subsystem| filter.is_empty() || filter.contains(subsystem));
        self.pending = rest;
        matching
    }
}

#[cfg(test)]
mod tests {
    use std::time::Duration;

    use tokio::time::timeout;

    use super::*;

    fn notify(sender: &broadcast::Sender<BridgeNotification>, subsystem: &str) {
        sender
            .send(BridgeNotification {
                subsystem: subsystem.into(),
            })
            .unwrap();
    }

    fn changed(subsystems: &[&str]) -> IdleResult {
        IdleResult::Changed(subsystems.iter().map(|name| name.to_string()).collect())
    }

    fn filter(subsystems: &[&str]) -> Vec<String> {
        subsystems.iter().map(|name| name.to_string()).collect()
    }

    async fn wait_now(tracker: &mut IdleTracker, subsystems: &[&str]) -> IdleResult {
        timeout(Duration::from_millis(100), tracker.wait(&filter(subsystems)))
            .await
            .expect("idle did not return immediately")
    }

    async fn is_blocked(tracker: &mut IdleTracker, subsystems: &[&str]) -> bool {
        timeout(Duration::from_millis(50), tracker.wait(&filter(subsystems)))
            .await
            .is_err()
    }

    #[tokio::test]
    async fn events_sent_before_idle_are_reported_immediately() {
        let (sender, receiver) = broadcast::channel(16);
        let mut tracker = IdleTracker::new(receiver);

        notify(&sender, "player");

        assert_eq!(wait_now(&mut tracker, &[]).await, changed(&["player"]));
    }

    #[tokio::test]
    async fn reported_subsystems_are_no_longer_pending() {
        let (sender, receiver) = broadcast::channel(16);
        let mut tracker = IdleTracker::new(receiver);

        notify(&sender, "player");
        wait_now(&mut tracker, &[]).await;

        assert!(is_blocked(&mut tracker, &[]).await);
    }

    #[tokio::test]
    async fn filtered_idle_leaves_other_subsystems_pending() {
        let (sender, receiver) = broadcast::channel(16);
        let mut tracker = IdleTracker::new(receiver);

        notify(&sender, "mixer");
        notify(&sender, "player");

        assert_eq!(
            wait_now(&mut tracker, &["player"]).await,
            changed(&["player"])
        );
        assert_eq!(wait_now(&mut tracker, &[]).await, changed(&["mixer"]));
    }

    #[tokio::test]
    async fn lag_marks_all_subsystems_pending() {
        let (sender, receiver) = broadcast::channel(2);
        let mut tracker = IdleTracker::new(receiver);

        notify(&sender, "player");
        notify(&sender, "player");
        notify(&sender, "player");
        notify(&sender, "player");

        assert_eq!(
            wait_now(&mut tracker, &[]).await,
            changed(&["player", "playlist", "mixer", "options"])
        );
    }
}
