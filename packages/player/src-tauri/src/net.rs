pub async fn bind_first_available_port(
    host: &str,
    port_start: u16,
    port_end: u16,
) -> Result<tokio::net::TcpListener, String> {
    let mut last_error = String::new();
    for port in port_start..=port_end {
        match tokio::net::TcpListener::bind(format!("{host}:{port}")).await {
            Ok(listener) => return Ok(listener),
            Err(err) => {
                log::debug!("Port {port} unavailable: {err}");
                last_error = format!("{err}");
            }
        }
    }
    Err(format!(
        "No available port in range {port_start}-{port_end}: {last_error}"
    ))
}
