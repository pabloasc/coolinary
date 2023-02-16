import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      No recipe selected. Select a recipe on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new note.
      </Link>
    </p>
  );
}
