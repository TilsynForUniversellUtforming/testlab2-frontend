import '@testing-library/jest-dom';

import TestlabForm from '@common/form/TestlabForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

type ExampleLiteral = 'one' | 'two';

type TestlabFormTestType = {
  name: string;
  optionalNumber?: number;
  literal?: ExampleLiteral;
};
const onSubmit: SubmitHandler<TestlabFormTestType> = () => undefined;

const validateOptional = (optionalNumberString?: string) => {
  if (optionalNumberString) {
    return !isNaN(Number(optionalNumberString));
  } else {
    return true;
  }
};

const nameError = 'name-error';
const numberError = 'number-error';
const literalError = 'literal-error';

const TestForm = () => {
  const literalSourceSchema = z.union([z.literal('one'), z.literal('two')]);

  const validationSchema = z.object({
    name: z.string().trim().nonempty(nameError),

    optionalNumber: z
      .string()
      .optional()
      .refine((value) => validateOptional(value), numberError),

    literal: literalSourceSchema
      .optional()
      .refine((value) => value !== undefined, literalError),
  });

  const formMethods = useForm<TestlabFormTestType>({
    defaultValues: {
      name: '',
      optionalNumber: 0,
      literal: undefined,
    },
    resolver: zodResolver(validationSchema),
  });

  return (
    <TestlabForm<TestlabFormTestType>
      heading={'TestHeading'}
      description={'TestDescription'}
      formMethods={formMethods}
      onSubmit={onSubmit}
    >
      <TestlabForm.FormInput label="Form input string" name="name" required />
      <TestlabForm.FormInput label="Form input number" name="optionalNumber" />
      <TestlabForm.FormSelect
        label="Form select"
        name="literal"
        options={[
          {
            label: '1',
            value: 'one',
          },
          {
            label: '2',
            value: 'two',
          },
        ]}
        required
      />
      <TestlabForm.FormButtons />
    </TestlabForm>
  );
};

describe('<TestlabForm />', () => {
  it('Should be able to create a form with children', () => {
    const { result } = renderHook(() => useForm<TestlabFormTestType>());

    const { getByText, getByRole } = render(
      <TestlabForm<TestlabFormTestType>
        heading={'TestHeading'}
        description={'TestDescription'}
        formMethods={result.current}
        onSubmit={onSubmit}
      >
        <div>Child</div>
      </TestlabForm>
    );

    expect(getByText('Child')).toBeInTheDocument();
    expect(getByText('TestHeading')).toBeInTheDocument();
    expect(getByRole('doc-subtitle')).toHaveTextContent('TestDescription');
  });

  it('Should display error message on illegal input', async () => {
    render(<TestForm />, {
      wrapper: BrowserRouter,
    });

    const submitButton = screen.getByText('Lagre');

    // Name input - error
    const nameInput = screen.getByLabelText('Form input string', {
      exact: false,
    });
    await userEvent.type(nameInput, ' ');

    // Number input - error
    const numberInput = screen.getByLabelText('Form input number', {
      exact: false,
    });
    await userEvent.type(numberInput, 'non-numeric');

    // Select empty - error

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(nameError)).toBeInTheDocument();
      expect(screen.queryByText(numberError)).toBeInTheDocument();
      expect(screen.queryByText(literalError)).toBeInTheDocument();
    });
  });

  it('Should not display error message on valid input', async () => {
    render(<TestForm />, {
      wrapper: BrowserRouter,
    });

    const submitButton = screen.getByText('Lagre');

    // Name input - ok
    const nameInput = screen.getByLabelText('Form input string', {
      exact: false,
    });
    await userEvent.type(nameInput, 'Hei');

    // Number input - ok
    const numberInput = screen.getByLabelText('Form input number', {
      exact: false,
    });
    await userEvent.type(numberInput, '123');

    // Select - ok
    const selectInput = screen.getByRole('combobox');
    await userEvent.click(selectInput);
    const option = await screen.findByLabelText('1');
    await userEvent.click(option);

    await waitFor(
      () => {
        userEvent.click(submitButton);
      },
      { timeout: 500 }
    );

    await waitFor(() => {
      expect(screen.queryByText(nameError)).not.toBeInTheDocument();
      expect(screen.queryByText(numberError)).not.toBeInTheDocument();
      expect(screen.queryByText(literalError)).not.toBeInTheDocument();
    });
  });
});
