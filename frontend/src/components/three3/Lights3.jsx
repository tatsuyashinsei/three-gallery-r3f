// Lights3.jsx

export default function Lights3() {
  return (
    <>
      <ambientLight intensity={Math.PI / 16} color={0xebfeff} />
      <directionalLight
        intensity={Math.PI * 2}
        color={0xebfeff}
        position={[-12, 0.1, 1]}
      />
    </>
  );
}