import * as Yup from 'yup';

const { string, array, object } = Yup;

export const PartiesFromValidation = object({
  consignee_name: array()
    .of(string().required("Consignee name is required"))
    .min(1, "At least one consignee name is required"),

  // gst_add: string().required("GST address is required"),

  // gst_in: array()
  //   .of(string().required("GST IN is required"))
  //   .min(1, "At least one GST IN is required"),

  contact_number: array()
    .of(
      string()
        .matches(/^[0-9]{10}$/, "Contact number must be exactly 10 digits")
        .required("Contact number is required")
    )
    .min(1, "At least one contact number is required"),

  // delivery_address: array()
  //   .of(string().required("Delivery address is required"))
  //   .min(1, "At least one delivery address is required"),

  email_id: array()
    .of(string().email("Invalid email").required("Email is required"))
    .min(1, "At least one email is required"),

  shipped_to: string().required("Shipped To address is required"),

  bill_to: string().required("Bill To address is required"),

  // shipped_gst_to: string().required("Shipped To GST is required"),

  // bill_gst_to: string().required("Bill To GST is required"),

  type: string().required("Type is a required field"),

  parties_type: string().required("Merchant Type is a required field"),
});

