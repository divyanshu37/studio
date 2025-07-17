import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomePageClient from '@/components/home-page-client';
import { Toaster } from '@/components/ui/toaster';

// Mocking necessary modules and hooks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

vi.mock('@/ai/flows/log-traffic-flow', () => ({
  logTrafficWithLocation: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/ai/flows/submit-lead-flow', () => ({
  submitLead: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/ai/flows/submit-slack', () => ({
    submitToSlack: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/hooks/use-socket', () => ({
  useSocket: vi.fn(() => ({
    // Mock whatever the hook returns, likely null or an empty object
  })),
}));

// A wrapper component to include the Toaster, as it's a dependency
const TestWrapper = ({ uuid }: { uuid: string }) => (
  <>
    <HomePageClient uuid={uuid} />
    <Toaster />
  </>
);

describe('HomePageClient - Form Step 1', () => {
    
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display validation errors for empty required fields on step 1', async () => {
    render(<TestWrapper uuid="test-uuid" />);

    const nextButton = screen.getByRole('button', { name: /NEXT/i });
    await userEvent.click(nextButton);

    // Wait for error messages to appear. 
    // The error message is shown in the navigation component.
    expect(await screen.findByText('First name is required.')).toBeInTheDocument();
  });
  
  it('should display validation error for invalid age (too young)', async () => {
    render(<TestWrapper uuid="test-uuid" />);
    
    await userEvent.type(screen.getByPlaceholderText('First Name'), 'John');
    await userEvent.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await userEvent.type(screen.getByPlaceholderText('Valid Phone Number'), '1234567890');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'john.doe@example.com');
    await userEvent.type(screen.getByPlaceholderText('Birthdate'), '01/01/2000'); // Too young
    
    // The gender select is a bit more complex to interact with
    const genderSelect = screen.getByRole('combobox', { name: '' });
    await userEvent.click(genderSelect);
    await userEvent.click(screen.getByText('Male'));
    
    const nextButton = screen.getByRole('button', { name: /NEXT/i });
    await userEvent.click(nextButton);

    expect(await screen.findByText(/You must be between 45 and 80 years old/i)).toBeInTheDocument();
  });

  it('should proceed to the next step with valid data', async () => {
    render(<TestWrapper uuid="test-uuid" />);

    // Check that we start on the right title
    expect(screen.getByText(/State and Congress Approved/)).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText('First Name'), 'Jane');
    await userEvent.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await userEvent.type(screen.getByPlaceholderText('Valid Phone Number'), '5551234567');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'jane.doe@example.com');
    await userEvent.type(screen.getByPlaceholderText('Birthdate'), '01/01/1970'); // Valid age
    
    const genderSelect = screen.getByRole('combobox', { name: '' });
    await userEvent.click(genderSelect);
    await userEvent.click(screen.getByText('Female'));
    
    const nextButton = screen.getByRole('button', { name: /NEXT/i });
    await userEvent.click(nextButton);

    // After clicking next, the first form should be gone and the second form should be visible.
    // A simple way to check is to look for an element unique to the next step (AdditionalQuestionsForm).
    await waitFor(() => {
        expect(screen.getByText(/Is the policy owner different than the insured/i)).toBeInTheDocument();
    });

    // Check that an error from the previous step is no longer visible
    expect(screen.queryByText(/You must be between 45 and 80 years old/i)).not.toBeInTheDocument();
  });

});
