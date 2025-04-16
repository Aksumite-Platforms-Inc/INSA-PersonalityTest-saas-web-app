export function TestInvitationEmail({
  employeeName,
  organizationName,
  loginUrl,
  username,
  password,
}: {
  employeeName: string
  organizationName: string
  loginUrl: string
  username: string
  password: string
}) {
  return (
    <div
      style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px", color: "#333" }}
    >
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#4f46e5", margin: "0" }}>INSA Personality Testing Platform</h1>
        <p style={{ color: "#6b7280", fontSize: "16px" }}>Your personality assessment invitation</p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>Hello {employeeName},</p>
        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
          You have been invited by <strong>{organizationName}</strong> to take a personality assessment on the INSA
          Personality Testing Platform.
        </p>
        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
          This assessment will help you gain valuable insights into your personality traits, strengths, and areas for
          development.
        </p>
      </div>

      <div style={{ background: "#f3f4f6", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
        <h2 style={{ margin: "0 0 15px 0", color: "#4f46e5" }}>Your Login Credentials</h2>
        <p style={{ margin: "5px 0", fontSize: "16px" }}>
          <strong>Username:</strong> {username}
        </p>
        <p style={{ margin: "5px 0", fontSize: "16px" }}>
          <strong>Password:</strong> {password}
        </p>
        <p style={{ margin: "15px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
          Please change your password after your first login.
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
          Take Your Assessment
        </a>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#4f46e5", margin: "0 0 15px 0" }}>What to Expect</h2>
        <ul style={{ paddingLeft: "20px", fontSize: "16px", lineHeight: "1.6" }}>
          <li>The assessment takes approximately 15-30 minutes to complete.</li>
          <li>Answer all questions honestly for the most accurate results.</li>
          <li>There are no right or wrong answers.</li>
          <li>Your results will be available immediately after completion.</li>
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
        <p>If you have any questions, please contact your administrator.</p>
        <p>&copy; {new Date().getFullYear()} INSA Personality Testing Platform. All rights reserved.</p>
      </div>
    </div>
  )
}
