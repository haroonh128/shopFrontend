import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { verifyOtp } from '../../auth/api/auth.api';
import { useNavigate } from 'react-router-dom';
import { setItem, setItemAsObject } from '../../shared';
import { useAuth } from '../../auth/hooks';

const formSchema = Yup.object({
  code: Yup.string().required('Code is required'),
});

export default function Otp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const formik = useFormik({
    initialValues: { code: '' },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      const number = localStorage.getItem("phoneNumber");
      const res = await verifyOtp({ phoneNumber: number?.toString() || '', otpCode: formik.values.code });
      if (res) {
        login(res?.accessToken || '');
        setItem("auth", res?.accessToken || '');
        setItemAsObject("user", res?.user || {});
        navigate("/modules");
      }
    },
    onReset: () => {
      formik.resetForm();
    },
  });
  return (
    <div className='min-h-screen w-full grid grid-cols-1 md:grid-cols-2'>
      <div className="login-image hidden md:block" />
      <div className="flex items-center justify-center p-6 bg-blue-700/50">
        <div className="block bg-white rounded-lg p-4 w-full max-w-md pb-10">
          <h5 className="text-2xl font-bold mb-4 text-neutral-900">Otp</h5>
          <p className="text-sm text-neutral-600 mb-4">Enter the code sent to your phone number</p>
          <div className="flex justify-between w-full">
            <form className="space-y-4 w-full" onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
              <label className="mb-1 block text-sm font-medium text-slate-700">Code</label>
              <InputNumber
                value={Number(formik.values.code || 0)}
                onValueChange={(e) => formik.setFieldValue('code', String(e.value ?? ''))}
                useGrouping={false}
                max={999999}
                className="w-full rounded-md border px-3 py-2 text-slate-900 outline-none"
              />
              <Button label="Verify" 
              type="submit"
              className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60" />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}