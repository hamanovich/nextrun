import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserInformation } from "../user-information";

describe("UserInformation", () => {
  const user = {
    id: "synthetic-user-123456789",
    name: "Demo Developer",
    email: "demo@example.invalid",
    image: "/synthetic-avatar.png",
  };
  it("shows the supplied identity with its avatar", () => {
    render(<UserInformation user={user} />);
    expect(screen.getByText(user.name)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: user.name })).toHaveAttribute(
      "src",
      user.image,
    );
  });
  it("shows the full account reference without redundant status badges", () => {
    render(<UserInformation user={user} />);
    expect(screen.getByText("User ID")).toBeInTheDocument();
    expect(screen.getByText(user.id)).toBeInTheDocument();
    expect(screen.queryByText("Active")).not.toBeInTheDocument();
    expect(screen.queryByText("Authenticated")).not.toBeInTheDocument();
  });
  it("handles missing identity fields", () => {
    render(<UserInformation user={{}} />);
    expect(screen.getByText("Anonymous User")).toBeInTheDocument();
    expect(screen.getByText("No email provided")).toBeInTheDocument();
    expect(screen.getByText("Not available")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
