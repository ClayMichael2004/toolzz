import { useState, useEffect } from "react";
import { getSelectedAgent, setSelectedAgent, fetchAIProviders } from "../services/api";
import { Cpu } from "lucide-react";

const DEFAULT_PROVIDERS = [
  { id: "auto", name: "Auto (Smart Failover)", description: "Auto switches between Groq, OpenRouter, and Gemini on limit", isFree: true, configured: true },
  { id: "groq", name: "Groq (Llama 3.3 70B)", description: "Blazing fast cloud inference (~500 t/s)", isFree: true, configured: false },
  { id: "openrouter", name: "OpenRouter Free", description: "Llama 3.2 / Gemma 2 / DeepSeek R1 free", isFree: true, configured: false },
  { id: "gemini", name: "Google Gemini", description: "Google Gemini Free Tier models", isFree: true, configured: true },
];

const AgentSwitcher = () => {
  const [providers, setProviders] = useState(DEFAULT_PROVIDERS);
  const [currentAgent, setCurrentAgent] = useState(getSelectedAgent());

  useEffect(() => {
    const loadProviders = async () => {
      const data = await fetchAIProviders();
      if (data && data.length > 0) {
        setProviders(data);
      }
    };
    loadProviders();

    const handleAgentChange = () => {
      setCurrentAgent(getSelectedAgent());
    };
    window.addEventListener("toolzz_agent_changed", handleAgentChange);
    return () => window.removeEventListener("toolzz_agent_changed", handleAgentChange);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setSelectedAgent(val);
    setCurrentAgent(val);
  };

  const activeProviderObj = providers.find((p) => p.id === currentAgent) || providers[0];

  return (
    <div className="agent-switcher-container">
      <div className="agent-switcher-header">
        <div className="agent-switcher-title">
          <Cpu size={14} className="agent-icon" />
          <span>Active AI Agent</span>
        </div>
        <span className="free-tag">100% FREE</span>
      </div>

      <select
        value={currentAgent}
        onChange={handleChange}
        className="agent-select-dropdown"
      >
        {providers.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} {p.id !== "auto" && !p.configured ? "(No Key)" : ""}
          </option>
        ))}
      </select>

      <div className="agent-status-footer">
        <span className="agent-dot"></span>
        <span className="agent-desc">{activeProviderObj?.description}</span>
      </div>
    </div>
  );
};

export default AgentSwitcher;
