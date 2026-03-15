const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="card text-center p-16">
      <div className="loader mx-auto mb-4" />
      <p className="text-muted">{text}</p>
    </div>
  );
};

export default Loader;