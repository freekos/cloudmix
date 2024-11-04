import { MantineClientProvider } from '@/providers/MantineClientProvider';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { SearchInput, SearchInputProps } from './SearchInput';

describe('SearchInput', () => {
  const renderComponent = (
    {
      label = 'Search',
      placeholder = 'Search by username or group name',
      value = 'search',
      error = 'Invalid search',
      ...props
    }: SearchInputProps = { onChange: () => {} },
  ) => {
    render(
      <SearchInput
        label={label}
        placeholder={placeholder}
        value={value}
        error={error}
        {...props}
      />,
      {
        wrapper: ({ children }: PropsWithChildren) => {
          return <MantineClientProvider>{children}</MantineClientProvider>;
        },
      },
    );
  };

  it('should render correctly', async () => {
    renderComponent();

    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search by username or group name'),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('search')).toBeInTheDocument();
    expect(screen.getByText('Invalid search')).toBeInTheDocument();
  });
});
