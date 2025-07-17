import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SelfEnrollComplete from '@/components/self-enroll-complete';

describe('SelfEnrollComplete Component', () => {
  it('should render the completion message and title', () => {
    // Render the component
    render(<SelfEnrollComplete />);

    // Check for the main heading
    const titleElement = screen.getByRole('heading', { name: /congratulations/i });
    expect(titleElement).toBeInTheDocument();

    // Check for the descriptive text
    const descriptionElement = screen.getByText(/Your application is complete and your policy is now active/i);
    expect(descriptionElement).toBeInTheDocument();
  });
});
