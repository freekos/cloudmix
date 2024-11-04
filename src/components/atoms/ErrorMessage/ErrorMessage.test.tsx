import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { ErrorMessage, ErrorMessageProps } from './ErrorMessage';

describe('ErrorMessage', () => {
  const renderComponent = ({
    children = 'Something went wrong',
    ...props
  }: ErrorMessageProps = {}) => {
    render(<ErrorMessage {...props}>{children}</ErrorMessage>);
  };

  it('should render correctly', async () => {
    renderComponent();

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
