use std::net::{IpAddr, SocketAddr};

use axum::{
    extract::{ConnectInfo, Request, State},
    http::{header::HOST, uri::Authority, StatusCode},
    middleware::Next,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;

#[derive(Clone, Copy)]
pub enum Audience {
    LocalNetwork,
    ThisComputer,
}

struct Caller {
    ip: IpAddr,
    host: Option<Authority>,
}

impl Caller {
    fn new(peer: SocketAddr, request: &Request) -> Self {
        let host = request
            .headers()
            .get(HOST)
            .and_then(|value| value.to_str().ok())
            .and_then(|value| value.parse().ok());
        Self {
            ip: peer.ip().to_canonical(),
            host,
        }
    }

    fn is_on_local_network(&self) -> bool {
        match self.ip {
            IpAddr::V4(ip) => ip.is_loopback() || ip.is_private() || ip.is_link_local(),
            IpAddr::V6(ip) => {
                ip.is_loopback() || ip.is_unique_local() || ip.is_unicast_link_local()
            }
        }
    }

    fn is_this_computer(&self) -> bool {
        self.ip.is_loopback()
    }

    fn addresses_server_by_ip_or_localhost(&self) -> bool {
        let Some(host) = &self.host else {
            return false;
        };
        let hostname = host.host().trim_start_matches('[').trim_end_matches(']');
        hostname == "localhost" || hostname.parse::<IpAddr>().is_ok()
    }
}

impl Audience {
    fn admits(self, caller: &Caller) -> bool {
        match self {
            Audience::LocalNetwork => {
                caller.is_on_local_network() && caller.addresses_server_by_ip_or_localhost()
            }
            Audience::ThisComputer => caller.is_this_computer(),
        }
    }
}

pub async fn restrict_to(
    State(audience): State<Audience>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    request: Request,
    next: Next,
) -> Response {
    if !audience.admits(&Caller::new(peer, &request)) {
        return (StatusCode::FORBIDDEN, Json(json!({ "error": "Forbidden" }))).into_response();
    }
    next.run(request).await
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::{
        body::Body, extract::connect_info::MockConnectInfo, middleware::from_fn_with_state,
        routing::get, Router,
    };
    use tower::ServiceExt;

    async fn status_for(audience: Audience, peer: &str, host: &str) -> StatusCode {
        let peer: SocketAddr = format!("{peer}:50000").parse().unwrap();
        let router = Router::new()
            .route("/", get(|| async { "ok" }))
            .layer(from_fn_with_state(audience, restrict_to))
            .layer(MockConnectInfo(peer));
        let request = Request::builder()
            .uri("/")
            .header(HOST, host)
            .body(Body::empty())
            .unwrap();
        router.oneshot(request).await.unwrap().status()
    }

    #[tokio::test]
    async fn local_network_admits_loopback_private_and_link_local_callers() {
        for peer in [
            "127.0.0.1",
            "10.1.2.3",
            "172.16.0.5",
            "192.168.1.42",
            "169.254.10.20",
            "[::1]",
            "[fd12:3456::1]",
            "[fe80::1]",
            "[::ffff:192.168.1.42]",
        ] {
            assert_eq!(
                status_for(Audience::LocalNetwork, peer, "192.168.1.10:4120").await,
                StatusCode::OK,
                "{peer}"
            );
        }
    }

    #[tokio::test]
    async fn local_network_rejects_public_callers_with_403() {
        for peer in [
            "8.8.8.8",
            "172.32.0.1",
            "100.64.0.1",
            "[2001:4860:4860::8888]",
            "[::ffff:8.8.8.8]",
        ] {
            assert_eq!(
                status_for(Audience::LocalNetwork, peer, "192.168.1.10:4120").await,
                StatusCode::FORBIDDEN,
                "{peer}"
            );
        }
    }

    #[tokio::test]
    async fn local_network_admits_ip_and_localhost_hosts() {
        for host in ["localhost:4120", "127.0.0.1:4120", "[::1]:4120"] {
            assert_eq!(
                status_for(Audience::LocalNetwork, "127.0.0.1", host).await,
                StatusCode::OK,
                "{host}"
            );
        }
    }

    #[tokio::test]
    async fn local_network_rejects_a_domain_name_host_with_403() {
        assert_eq!(
            status_for(Audience::LocalNetwork, "127.0.0.1", "attacker.example:4120").await,
            StatusCode::FORBIDDEN
        );
    }

    #[tokio::test]
    async fn this_computer_rejects_a_lan_caller_with_403() {
        assert_eq!(
            status_for(Audience::ThisComputer, "192.168.1.42", "192.168.1.10:4120").await,
            StatusCode::FORBIDDEN
        );
    }

    #[tokio::test]
    async fn this_computer_admits_loopback() {
        assert_eq!(
            status_for(Audience::ThisComputer, "127.0.0.1", "localhost:4120").await,
            StatusCode::OK
        );
    }
}
