import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const errorMessages: string[] = [];

  if (isRouteErrorResponse(error)) {
    errorMessages.push(`${error.status}: ${error.statusText}`);
  } else if (error instanceof Error) {
    errorMessages.push(error.message);
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessages.join(" + ")}</i>
      </p>
    </div>
  );
}