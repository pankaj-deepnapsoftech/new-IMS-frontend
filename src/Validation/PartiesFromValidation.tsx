//@ts-nocheck 



import * as Yup from 'yup';

 export const PartiesFromValidation = Yup.object({
    type: Yup.string().required('Type is required'),
    parties_type: Yup.string().required('Parties type is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone must be exactly 10 digits')
      .required('Phone is required'),
  
    full_name: Yup.string().when('type', {
      is: 'Individual',
      then: (schema) => schema.required('Full name is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
    company_name: Yup.string().when('type', {
      is: 'Company',
      then: (schema) => schema.required('Company name is required'),
      otherwise: (schema) => schema.notRequired(),
    }),

  });
  
