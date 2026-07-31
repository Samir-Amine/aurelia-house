export default function SectionDivider({ tone = "brass" }) {
  const stroke = tone === "linen" ? "#F7F5F1" : "#B8935A";
  return (
    <div className="w-full overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        className="w-full h-6"
      >
        <path
          d="M0 12 Q 150 0, 300 12 T 600 12 T 900 12 T 1200 12"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
