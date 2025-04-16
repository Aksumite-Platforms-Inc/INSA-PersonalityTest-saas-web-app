export function TestResultsEmail({
  employeeName,
  organizationName,
  testType,
  completionDate,
  personalityType,
  loginUrl,
}: {
  employeeName: string
  organizationName: string
  testType: string
  completionDate: string
  personalityType: string
  loginUrl: string
}) {
  return (
    <div
      style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px", color: "#333" }}
    >
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#4f46e5", margin: "0" }}>INSA Personality Testing Platform</h1>
        <p style={{ color: "#6b7280", fontSize: "16px" }}>Your personality assessment results</p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>Hello {employeeName},</p>
        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
          Thank you for completing the <strong>{testType}</strong> on the INSA Personality Testing Platform.
        </p>
        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
          Your results are now available for viewing. Below is a summary of your personality profile.
        </p>
      </div>

      <div style={{ background: "#f3f4f6", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
        <h2 style={{ margin: "0 0 15px 0", color: "#4f46e5" }}>Assessment Summary</h2>
        <p style={{ margin: "5px 0", fontSize: "16px" }}>
          <strong>Test Type:</strong> {testType}
        </p>
        <p style={{ margin: "5px 0", fontSize: "16px" }}>
          <strong>Completion Date:</strong> {completionDate}
        </p>
        <p style={{ margin: "5px 0", fontSize: "16px" }}>
          <strong>Personality Type:</strong> {personalityType}
        </p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <a
          href={loginUrl}
          style={{
            display: "inline-block",
            background: "#4f46e5",
            color: "white",
            padding: "12px 24px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          View Full Results
        </a>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#4f46e5", margin: "0 0 15px 0" }}>What's Next?</h2>
        <ul style={{ paddingLeft: "20px", fontSize: "16px", lineHeight: "1.6" }}>
          <li>Review your detailed results on the platform.</li>
          <li>Explore your strengths and areas for development.</li>
          <li>Consider how these insights can help you in your professional growth.</li>
          <li>Discuss your results with your manager if appropriate.</li>
        </ul>
      </div>

      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: "20px",
          fontSize: "14px",
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        <p>If you have any questions about your results, please contact your administrator.</p>
        <p>&copy; {new Date().getFullYear()} INSA Personality Testing Platform. All rights reserved.</p>
      </div>
    </div>
  )
}
