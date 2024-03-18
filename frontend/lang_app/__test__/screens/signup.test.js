import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { useDispatch } from "react-redux";
import { createUserEmailAndPassword } from "../../firebase/auth/user";
import { setUser } from "../../redux/slices/userSlice";
import Signup from "../../app/signup";

// jest.mock("react-redux", () => ({
//     useDispatch: jest.fn(),
// }));

// jest.mock("../../lang_app/firebase/auth/user", () => ({
//     createUserEmailAndPassword: jest.fn(),
// }));

// jest.mock("../../lang_app/redux/slices/userSlice", () => ({
//     setUser: jest.fn(),
// }));

describe("Signup", () => {
    beforeEach(() => {
        useDispatch.mockReturnValue(jest.fn());
    });

    test("renders without errors", () => {
        render(<Signup />);
    });

    test("calls createUserEmailAndPassword and dispatches setUser on successful signup", async () => {
        const mockDispatch = jest.fn();
        useDispatch.mockReturnValue(mockDispatch);
        createUserEmailAndPassword.mockResolvedValueOnce({
            userData: { id: 1, name: "John Doe" },
        });

        const { getByPlaceholderText, getByText } = render(<Signup />);
        const emailInput = getByPlaceholderText("Email");
        const passwordInput = getByPlaceholderText("Password");
        const confirmPasswordInput = getByPlaceholderText("Confirm Password");
        const nameInput = getByPlaceholderText("Full Name");
        const dobInput = getByPlaceholderText("Date of Birth (DD/MM/YYYY)");
        const phoneNumberInput = getByPlaceholderText("Phone Number");
        const createAccountButton = getByText("Create Account");

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
        fireEvent.change(nameInput, { target: { value: "John Doe" } });
        fireEvent.change(dobInput, { target: { value: "01/01/1990" } });
        fireEvent.change(phoneNumberInput, { target: { value: "1234567890" } });
        fireEvent.click(createAccountButton);

        expect(createUserEmailAndPassword).toHaveBeenCalledWith(
            "test@example.com",
            "password123",
            {
                name: "John Doe",
                dob: "01/01/1990",
                email: "test@example.com",
                language: "",
                phoneNumber: "1234567890",
                autoSpeak: true,
                cortexxCoin: 0,
                Hearts: 10,
                heartsLastRefill: expect.any(Date),
                numberOfMessages: 20,
                subscriptionStatus: "free",
            }
        );

        await Promise.resolve(); // Wait for the async action to complete
        expect(mockDispatch).toHaveBeenCalledWith(setUser({ id: 1, name: "John Doe" }));
    });

    // Add more tests for other functionality in your component
});
