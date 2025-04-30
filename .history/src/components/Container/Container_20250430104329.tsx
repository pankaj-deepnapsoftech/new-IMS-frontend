interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className="w-full m-0 px-6 py-4 rounded overflow-auto h-screen  scrollbar-hidden " 
      style={{ boxShadow: "0 0 20px 3px rgba(221, 230, 240, 0.15)" }}
    >
      {children}
    </div>
  );
};

export default Container;
