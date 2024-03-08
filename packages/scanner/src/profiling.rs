#[cfg(feature = "profiling")]
pub struct Profiler {
    label: String,
    start: std::time::Instant,
}

#[cfg(feature = "profiling")]
impl Profiler {
    pub fn start(label: &str) -> Self {
        Profiler {
            label: label.to_owned(),
            start: std::time::Instant::now(),
        }
    }

    pub fn end(self) {
        let duration = self.start.elapsed();
        println!("{} - Elapsed time: {:?}", self.label, duration);
    }
}

#[cfg(feature = "profiling")]
impl Drop for Profiler {
    fn drop(&mut self) {
        let duration = self.start.elapsed();
        println!("{} - Elapsed time: {:?}", self.label, duration);
    }
}

// Provide no-op implementations when profiling feature is not enabled
#[cfg(not(feature = "profiling"))]
pub struct Profiler;

#[cfg(not(feature = "profiling"))]
impl Profiler {
    pub fn start(_label: &str) -> Self {
        Profiler {}
    }

    pub fn end(self) {
        // Do nothing
    }
}
