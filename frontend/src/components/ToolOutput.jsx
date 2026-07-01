const ToolOutput = ({ output }) => {
  return (
    <div
      style={{
        marginTop: "25px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        minHeight: "200px",
        background: "#fafafa",
      }}
    >
      <h3>AI Output</h3>

      {output ? (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            fontFamily: "inherit",
          }}
        >
          {output}
        </pre>
      ) : (
        <p>No output generated yet.</p>
      )}
    </div>
  );
};

export default ToolOutput;
