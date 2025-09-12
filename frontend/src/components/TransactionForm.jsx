import { useState, useEffect, useRef } from "react";
import {
  User,
  DollarSign,
  TrendingUp,
  Tag,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const toDateInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

const InputField = ({
  icon: Icon,
  name,
  type = "text",
  placeholder,
  required = false,
  children,
  form,
  errors,
  touched,
  isSubmitting,
  onChange,
  onBlur,
}) => {
  const hasError = errors[name] && touched[name];
  const hasValue = form[name];

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700" htmlFor={name}>
        {placeholder}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon
            className={`h-5 w-5 transition-colors duration-200 ${
              hasError
                ? "text-red-400"
                : hasValue
                  ? "text-green-500"
                  : "text-gray-400"
            }`}
          />
        </div>
        {children || (
          <input
            id={name}
            name={name}
            type={type}
            value={form[name]}
            onChange={onChange}
            onBlur={onBlur}
            className={`
              w-full pl-10 pr-10 py-3 rounded-lg border transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-2 placeholder-gray-400
              ${
                hasError
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50"
                  : hasValue
                    ? "border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-white"
              }
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
            `}
            placeholder={placeholder}
            required={required}
            disabled={isSubmitting}
          />
        )}

        {touched[name] && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {hasError ? (
              <AlertCircle className="h-5 w-5 text-red-400 animate-pulse" />
            ) : hasValue ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 animate-bounce" />
            ) : null}
          </div>
        )}
      </div>
      {hasError && (
        <p className="text-red-600 text-sm mt-1 animate-pulse flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {errors[name]}
        </p>
      )}
    </div>
  );
};

const TransactionForm = ({ onSubmit, initialData = {} }) => {
  const didMountRef = useRef(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "income",
    category: "",
    description: "",
    date: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!didMountRef.current) {
      setForm({
        title: initialData.title || "",
        amount: initialData.amount ?? "",
        type: initialData.type || "income",
        category: initialData.category || "",
        description: initialData.description || "",
        date: toDateInput(initialData.date),
      });
      didMountRef.current = true;
    }
  }, [initialData]);

  const validateField = (name, value) => {
    switch (name) {
      case "title":
        return !value.trim() ? "Title is required" : "";
      case "amount":
        return !value || Number(value) <= 0
          ? "Amount must be greater than 0"
          : "";
      case "category":
        return !value.trim() ? "Category is required" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "amount" ? Number(value) : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      title: true,
      amount: true,
      category: true,
    });

    if (Object.keys(newErrors).length === 0) {
      try {
        await onSubmit({
          ...form,
          date: form.date ? new Date(form.date).toISOString() : undefined,
        });
      } catch (error) {
        console.error("Submission error:", error);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="transform transition-all duration-500 ease-in-out">
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          icon={User}
          name="title"
          placeholder="Transaction Title"
          required
          form={form}
          errors={errors}
          touched={touched}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <InputField
          icon={DollarSign}
          name="amount"
          type="number"
          placeholder="Amount"
          required
          form={form}
          errors={errors}
          touched={touched}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <InputField
          icon={TrendingUp}
          name="type"
          placeholder="Transaction Type"
          form={form}
          errors={errors}
          touched={touched}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`
              w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-2 bg-white
              ${
                form.type === "income"
                  ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                  : "border-red-300 focus:border-red-500 focus:ring-red-200"
              }
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
            `}
            disabled={isSubmitting}
          >
            <option value="income">💰 Income</option>
            <option value="expense">💸 Expense</option>
          </select>
        </InputField>

        <InputField
          icon={Tag}
          name="category"
          placeholder="Category"
          required
          form={form}
          errors={errors}
          touched={touched}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <InputField
          icon={FileText}
          name="description"
          placeholder="Description (Optional)"
          form={form}
          errors={errors}
          touched={touched}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <InputField
          icon={Calendar}
          name="date"
          type="date"
          placeholder="Date"
          form={form}
          errors={errors}
          touched={touched}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-4 focus:ring-blue-300 transform
            ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 active:scale-95"
            }
            ${isSubmitting ? "animate-pulse" : "hover:shadow-lg"}
          `}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            "Submit Transaction"
          )}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
