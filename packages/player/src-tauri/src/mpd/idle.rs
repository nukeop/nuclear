use tokio::sync::broadcast;
use tokio::sync::broadcast::error::{RecvError, TryRecvError};

use crate::bridge::types::BridgeNotification;

pub enum IdleResult {
    Changed(Vec<String>),
    Closed,
}

pub struct IdleWait {
    receiver: broadcast::Receiver<BridgeNotification>,
    subsystems: Vec<String>,
}

impl IdleWait {
    pub fn new(receiver: broadcast::Receiver<BridgeNotification>, subsystems: Vec<String>) -> Self {
        Self { receiver, subsystems }
    }

    pub async fn wait(&mut self) -> IdleResult {
        loop {
            match self.receiver.recv().await {
                Ok(notification) => {
                    let mut changed: Vec<String> = Vec::new();
                    self.collect(&mut changed, notification.subsystem);
                    self.drain(&mut changed);

                    if !changed.is_empty() {
                        return IdleResult::Changed(changed);
                    }
                }
                Err(RecvError::Lagged(_)) => continue,
                Err(RecvError::Closed) => return IdleResult::Closed,
            }
        }
    }

    fn is_relevant(&self, subsystem: &str) -> bool {
        self.subsystems.is_empty() || self.subsystems.iter().any(|s| s == subsystem)
    }

    fn collect(&self, changed: &mut Vec<String>, subsystem: String) {
        if self.is_relevant(&subsystem) && !changed.contains(&subsystem) {
            changed.push(subsystem);
        }
    }

    fn drain(&mut self, changed: &mut Vec<String>) {
        loop {
            match self.receiver.try_recv() {
                Ok(BridgeNotification { subsystem }) => self.collect(changed, subsystem),
                Err(TryRecvError::Empty) => break,
                Err(TryRecvError::Lagged(_)) => break,
                Err(TryRecvError::Closed) => break,
            }
        }
    }
}
