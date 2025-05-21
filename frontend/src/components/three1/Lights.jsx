// Lights.jsx

const Lights = () => (
  <>
    <ambientLight intensity={2} />
    <directionalLight color="red" intensity={5.5} position={[2, -4, 0]} />
    <directionalLight color="blue" intensity={5.5} position={[-2, -4, 0]} />
    <directionalLight color="pink" intensity={3} position={[0, 1, 2]} />
    <directionalLight color="yellow" intensity={1.0} position={[0, 0, -2]} />
  </>
)

export default Lights