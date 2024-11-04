import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { NextLink, NextLinkProps } from './NextLink';

describe('NextLink', () => {
  const renderComponent = (
    { children = 'Next.js', ...props }: NextLinkProps = { href: '/' },
  ) => {
    render(<NextLink {...props}>{children}</NextLink>);
  };

  it('should render correctly', async () => {
    renderComponent();

    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });
});
