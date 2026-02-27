function NotFound({ message }: { message?: string }) {
  return (
    <>
      <h1>404 - Not Found</h1>
      <p>{message || "The page you are looking for does not exist."}</p>
    </>
  );
}

export default NotFound;
