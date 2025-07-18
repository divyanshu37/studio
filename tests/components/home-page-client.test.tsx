
import { render, screen, fireEvent, waitFor, getByRole as getByRoleInElement } from '@testing-library/react';
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

// Declare mocks that will be used in the factories
let logTrafficWithLocation: any;
let submitLead: any;
let submitToSlack: any;

vi.mock('@/ai/flows/log-traffic-flow', () => ({
  logTrafficWithLocation: (...args: any[]) => logTrafficWithLocation(...args),
}));

vi.mock('@/ai/flows/submit-lead-flow', () => ({
  submitLead: (...args: any[]) => submitLead(...args),
}));

vi.mock('@/ai/flows/submit-slack', () => ({
    submitToSlack: (...args: any[]) => submitToSlack(...args),
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
    // Reset mocks before each test
    logTrafficWithLocation = vi.fn().mockResolvedValue({ success: true });
    submitLead = vi.fn().mockResolvedValue({ success: true });
    submitToSlack = vi.fn().mockResolvedValue({ success: true });
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
    const genderSelect = screen.getByRole('combobox');
    await userEvent.click(genderSelect);
    // Use `getByRole` on the listbox to be more specific
    const listbox = await screen.findByRole('listbox');
    await userEvent.click(getByRoleInElement(listbox, 'option', { name: 'Male' }));
    
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
    
    const genderSelect = screen.getByRole('combobox', { name: /gender/i });
    await userEvent.click(genderSelect);
    const listbox = await screen.findByRole('listbox');
    await userEvent.click(getByRoleInElement(listbox, 'option', { name: 'Female' }));
    
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


describe('HomePageClient - Form Step 2', () => {
  beforeEach(() => {
    // Reset mocks before each test
    logTrafficWithLocation = vi.fn().mockResolvedValue({ success: true });
    submitLead = vi.fn().mockResolvedValue({ success: true });
    submitToSlack = vi.fn().mockResolvedValue({ success: true });
  });

  const fillStepOne = async () => {
    await userEvent.type(screen.getByPlaceholderText('First Name'), 'Jane');
    await userEvent.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await userEvent.type(screen.getByPlaceholderText('Valid Phone Number'), '5551234567');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'jane.doe@example.com');
    await userEvent.type(screen.getByPlaceholderText('Birthdate'), '01/01/1970');
    const genderSelect = screen.getByRole('combobox', { name: /gender/i });
    await userEvent.click(genderSelect);
    const listbox = await screen.findByRole('listbox');
    await userEvent.click(getByRoleInElement(listbox, 'option', { name: 'Female' }));
    await userEvent.click(screen.getByRole('button', { name: /NEXT/i }));
  };
  
  it('should display validation errors for unanswered questions on step 2', async () => {
    render(<TestWrapper uuid="test-uuid" />);
    await fillStepOne();
    
    await waitFor(() => {
      expect(screen.getByText(/Is the policy owner different than the insured/i)).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /NEXT/i });
    await userEvent.click(nextButton);

    expect(await screen.findByText('Please select an option.')).toBeInTheDocument();
  });

  it('should proceed to step 3 with valid answers', async () => {
    render(<TestWrapper uuid="test-uuid" />);
    await fillStepOne();

    await waitFor(() => {
      expect(screen.getByText(/Is the policy owner different than the insured/i)).toBeInTheDocument();
    });

    // A more robust way to select the 'No' buttons for each question
    const questions = [
      'Is the policy owner different than the insured?',
      'Have you ever been diagnosed or treated for HIV, AIDS, bipolar, schizophrenia, dementia, or any progressive neurological disorder?',
      'Have you ever used oxygen or dialysis for any condition?',
      'In the last 5 years, have you had cancer (non-skin), stroke, heart attack, insulin-treated diabetes, COPD, hepatitis, cirrhosis, drug/alcohol abuse, PAH, hereditary angioedema, or pending tests for any of these?',
      'Have you used any nicotine products in the past 12 months?',
      'Do you have any existing life or annuity policies with this or another company?',
      'Do you have any other health issues?'
    ];

    for (const questionText of questions) {
      const questionElement = screen.getByText(questionText);
      const formItem = questionElement.closest('.bg-card\\/50');
      if (!formItem) throw new Error(`Could not find form item for question: ${questionText}`);
      
      const noButton = getByRoleInElement(formItem as HTMLElement, 'button', { name: "No" });
      await userEvent.click(noButton);
    }
    
    const nextButton = screen.getByRole('button', { name: /NEXT/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
        expect(screen.getByPlaceholderText("Applicant's Primary Address")).toBeInTheDocument();
    });

    // Ensure no validation errors from step 2 are visible
    expect(screen.queryByText('Please select an option.')).not.toBeInTheDocument();
  });
});

describe('HomePageClient - Form Step 3', () => {
  beforeEach(() => {
    // Reset mocks before each test
    logTrafficWithLocation = vi.fn().mockResolvedValue({ success: true });
    submitLead = vi.fn().mockResolvedValue({ success: true });
    submitToSlack = vi.fn().mockResolvedValue({ success: true });
  });

  const fillStepOneAndTwo = async () => {
    // Fill step 1
    await userEvent.type(screen.getByPlaceholderText('First Name'), 'Jane');
    await userEvent.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await userEvent.type(screen.getByPlaceholderText('Valid Phone Number'), '5551234567');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'jane.doe@example.com');
    await userEvent.type(screen.getByPlaceholderText('Birthdate'), '01/01/1970');
    
    const genderSelect = screen.getByRole('combobox', { name: /gender/i });
    await userEvent.click(genderSelect);
    const genderListbox = await screen.findByRole('listbox');
    await userEvent.click(getByRoleInElement(genderListbox, 'option', { name: 'Female' }));
    
    await userEvent.click(screen.getByRole('button', { name: /NEXT/i }));
    
    // Fill step 2
    await waitFor(() => {
      expect(screen.getByText(/Is the policy owner different than the insured/i)).toBeInTheDocument();
    });

    const questions = [
      'Is the policy owner different than the insured?',
      'Have you ever been diagnosed or treated for HIV, AIDS, bipolar, schizophrenia, dementia, or any progressive neurological disorder?',
      'Have you ever used oxygen or dialysis for any condition?',
      'In the last 5 years, have you had cancer (non-skin), stroke, heart attack, insulin-treated diabetes, COPD, hepatitis, cirrhosis, drug/alcohol abuse, PAH, hereditary angioedema, or pending tests for any of these?',
      'Have you used any nicotine products in the past 12 months?',
      'Do you have any existing life or annuity policies with this or another company?',
      'Do you have any other health issues?'
    ];
    for (const q of questions) {
      const qEl = screen.getByText(q);
      const formItem = qEl.closest('.bg-card\\/50');
      if (!formItem) throw new Error(`Could not find form item for: ${q}`);
      await userEvent.click(getByRoleInElement(formItem as HTMLElement, 'button', { name: 'No' }));
    }
    
    await userEvent.click(screen.getByRole('button', { name: /NEXT/i }));
  };

  it('should display validation errors for empty required fields on step 3', async () => {
    render(<TestWrapper uuid="test-uuid" />);
    await fillStepOneAndTwo();

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Applicant's Primary Address")).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /NEXT/i });
    await userEvent.click(nextButton);
    
    expect(await screen.findByText('Address is required.')).toBeInTheDocument();
  });
  
  it('should proceed to step 4 with valid data and call submitLead', async () => {
    render(<TestWrapper uuid="test-uuid" />);
    await fillStepOneAndTwo();

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Applicant's Primary Address")).toBeInTheDocument();
    });

    // Fill in step 3 form
    await userEvent.type(screen.getByPlaceholderText("Applicant's Primary Address"), "123 Main St");
    await userEvent.type(screen.getByPlaceholderText("City"), "Anytown");
    await userEvent.type(screen.getByPlaceholderText("Zip Code"), "12345");
    
    const stateSelect = screen.getByRole('combobox', { name: /state/i });
    await userEvent.click(stateSelect);
    const stateListbox = await screen.findByRole('listbox');
    await userEvent.click(getByRoleInElement(stateListbox, 'option', { name: 'California' }));
    
    await userEvent.type(screen.getByPlaceholderText("Beneficiary First Name"), "Ben");
    await userEvent.type(screen.getByPlaceholderText("Beneficiary Last Name"), "Ficiary");

    const relationSelect = screen.getByRole('combobox', { name: /relationship/i });
    await userEvent.click(relationSelect);
    const relationListbox = await screen.findByRole('listbox');
    await userEvent.click(getByRoleInElement(relationListbox, 'option', { name: 'Spouse' }));

    const coverageSelect = screen.getByRole('combobox', { name: /coverage/i });
    await userEvent.click(coverageSelect);
    const coverageListbox = await screen.findByRole('listbox');
    await userEvent.click(getByRoleInElement(coverageListbox, 'option', { name: '$ 20,000' }));

    const nextButton = screen.getByRole('button', { name: /NEXT/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
        expect(screen.getByPlaceholderText("Account Holder Name")).toBeInTheDocument();
    });

    // Check that submitLead was called
    expect(submitLead).toHaveBeenCalledTimes(1);
    
    // Ensure no validation errors from step 3 are visible
    expect(screen.queryByText('Address is required.')).not.toBeInTheDocument();
  });
});
