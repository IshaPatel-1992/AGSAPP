import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";

const membershipConfig = {
  "Family Membership": {
    label: "Family Membership",
    adults: 2,
    kids: 0,
  },
  "Single Adult Membership": {
    label: "Single Adult Membership",
    adults: 1,
    kids: 0,
  },
  "Student Membership": {
    label: "Student Membership",
    adults: 1,
    kids: 0,
  },
  "Senior Couple Membership": {
    label: "Senior Couple Membership",
    adults: 2,
    kids: 0,
  },
  "Family One Adult": {
    label: "One Adult + Children",
    adults: 1,
    kids: 2,
  },
  "Senior Single Membership": {
    label: "Senior Single Membership",
    adults: 1,
    kids: 0,
  },
};

const createAdult = () => ({
  fullName: "",
  dob: "",
  phone: "",
  relation: "",
  idProof: null,
  studentIdProof: null,
});

const createChild = () => ({
  fullName: "",
  dob: "",
  relation: "Child",
});

const createEmptyErrors = () => ({
  mainContactName: "",
  email: "",
  phone: "",
  adults: [],
  kids: [],
});

export default function MembershipForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const editMode = Boolean(location.state?.editMode);
  const applicationId = location.state?.applicationId || null;

  const [accountHolder, setAccountHolder] = useState(null);
  const [membershipTypeDetails, setMembershipTypeDetails] = useState(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState(createEmptyErrors());

  const [formData, setFormData] = useState({
    membershipType: location.state?.membershipType || "",
    mainContactName: "",
    email: "",
    phone: "",
    message: "",
    adults: [],
    kids: [],
  });

  const currentConfig = useMemo(
    () => membershipConfig[formData.membershipType],
    [formData.membershipType]
  );

  const inputClass = (hasError) =>
    `w-full border rounded-lg px-4 py-2 outline-none transition ${hasError
      ? "border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-gray-300 focus:ring-2 focus:ring-yellow-200"
    }`;

  const nameRegex = /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  const isValidDOB = (dob) => {
    if (!dob) return false;

    const date = new Date(dob);
    if (isNaN(date.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    return date < today;
  };

  useEffect(() => {
    const savedMember = localStorage.getItem("member");

    if (!savedMember) {
      navigate("/login");
      return;
    }

    try {
      const parsedMember = JSON.parse(savedMember);
      setAccountHolder(parsedMember);

      setFormData((prev) => ({
        ...prev,
        mainContactName: prev.mainContactName || parsedMember.full_name || "",
        email: prev.email || parsedMember.email || "",
        phone: prev.phone || parsedMember.phone || "",
      }));
    } catch (error) {
      console.error("Failed to parse member:", error);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const loadApplicationForEdit = async () => {
      if (!editMode || !applicationId) return;

      try {
        const result = await api.post("getMembershipApplicationById.php", {
          id: applicationId,
        });

        if (!result?.success) {
          alert(result?.message || "Failed to load application");
          return;
        }

        const app = result.application || {};
        const people = result.people || [];

        const adults = people
          .filter((person) => person.person_type === "Adult")
          .map((person) => ({
            fullName: person.full_name || "",
            dob: person.dob || "",
            phone: person.phone || "",
            relation: person.relation || "",
            idProof: person.id_proof || null,
            studentIdProof: person.student_id_proof || null,
          }));

        const kids = people
          .filter((person) => person.person_type === "Child")
          .map((person) => ({
            fullName: person.full_name || "",
            dob: person.dob || "",
            relation: person.relation || "Child",
          }));

        setFormData((prev) => ({
          ...prev,
          membershipType: app.membership_type || prev.membershipType || "",
          mainContactName: app.main_contact_name || "",
          email: app.email || "",
          phone: app.phone || "",
          message: app.notes || "",
          adults: adults.length ? adults : [],
          kids: kids.length ? kids : [],
        }));
      } catch (error) {
        console.error("Edit load error:", error);
        alert("Something went wrong while loading application");
      }
    };

    loadApplicationForEdit();
  }, [editMode, applicationId]);

  useEffect(() => {
    if (!formData.membershipType || editMode) return;

    const config = membershipConfig[formData.membershipType];
    if (!config) return;

    setFormData((prev) => ({
      ...prev,
      adults: Array.from({ length: config.adults }, () => createAdult()),
      kids: Array.from({ length: config.kids }, () => createChild()),
    }));

    setErrors(createEmptyErrors());
  }, [formData.membershipType, editMode]);

  useEffect(() => {
    const loadPricing = async () => {
      if (!formData.membershipType) return;

      try {
        setPricingLoading(true);
        setPricingError("");
        setMembershipTypeDetails(null);

        const result = await api.get("getMembershipTypes.php");

        if (!result?.success) {
          setPricingError(result?.message || "Failed to load pricing.");
          return;
        }

        const selected = (result.data || []).find(
          (item) => item.name === formData.membershipType
        );

        if (!selected) {
          setPricingError("Membership type not found.");
          return;
        }

        setMembershipTypeDetails(selected);
      } catch (err) {
        console.error("Pricing load error:", err);
        setPricingError("Something went wrong while loading pricing.");
      } finally {
        setPricingLoading(false);
      }
    };

    loadPricing();
  }, [formData.membershipType]);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const updateAdult = (index, field, value) => {
    let newValue = value;

    if (field === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => {
      const updated = [...prev.adults];
      updated[index] = { ...updated[index], [field]: newValue };
      return { ...prev, adults: updated };
    });

    setErrors((prev) => {
      const updatedAdultErrors = [...(prev.adults || [])];
      updatedAdultErrors[index] = {
        ...(updatedAdultErrors[index] || {}),
        [field]: "",
      };
      return { ...prev, adults: updatedAdultErrors };
    });
  };

  const updateChild = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.kids];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, kids: updated };
    });

    setErrors((prev) => {
      const updatedKidErrors = [...(prev.kids || [])];
      updatedKidErrors[index] = {
        ...(updatedKidErrors[index] || {}),
        [field]: "",
      };
      return { ...prev, kids: updatedKidErrors };
    });
  };

  const addChild = () => {
    setFormData((prev) => ({
      ...prev,
      kids: [...prev.kids, createChild()],
    }));

    setErrors((prev) => ({
      ...prev,
      kids: [...(prev.kids || []), {}],
    }));
  };

  const removeChild = (index) => {
    setFormData((prev) => {
      const updated = [...prev.kids];
      updated.splice(index, 1);
      return { ...prev, kids: updated };
    });

    setErrors((prev) => {
      const updated = [...(prev.kids || [])];
      updated.splice(index, 1);
      return { ...prev, kids: updated };
    });
  };

  const getAge = (dob) => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const validateBasicFields = () => {
    const newErrors = createEmptyErrors();
    let isValid = true;

    if (!nameRegex.test(formData.mainContactName.trim())) {
      newErrors.mainContactName =
        "Please enter full name with first name and last name.";
      isValid = false;
    }

    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
      isValid = false;
    }

    newErrors.adults = (formData.adults || []).map((adult) => {
      const adultError = {};

      if (!nameRegex.test((adult.fullName || "").trim())) {
        adultError.fullName =
          "Please enter full name with first name and last name.";
        isValid = false;
      }

      if (!isValidDOB(adult.dob)) {
        adultError.dob = "Please enter a valid date of birth.";
        isValid = false;
      }

      if (!phoneRegex.test((adult.phone || "").trim())) {
        adultError.phone = "Phone number must be exactly 10 digits.";
        isValid = false;
      }

      if (!(adult.relation || "").trim()) {
        adultError.relation = "Relation is required.";
        isValid = false;
      }

      return adultError;
    });

    newErrors.kids = (formData.kids || []).map((child) => {
      const childError = {};

      if (!nameRegex.test((child.fullName || "").trim())) {
        childError.fullName =
          "Please enter full name with first name and last name.";
        isValid = false;
      }

      if (!isValidDOB(child.dob)) {
        childError.dob = "Please enter a valid date of birth.";
        isValid = false;
      }

      return childError;
    });

    setErrors(newErrors);
    return isValid;
  };

  const validateMembershipRules = () => {
    const type = formData.membershipType;
    const adults = formData.adults || [];
    const kids = formData.kids || [];

    if (type === "Family Membership") {
      if (adults.length !== 2) {
        return "Family Membership requires 2 adults.";
      }

      for (let i = 0; i < adults.length; i++) {
        const age = getAge(adults[i].dob);
        if (age === null || age < 18) {
          return `Adult ${i + 1} must be at least 18 years old.`;
        }
      }

      for (let i = 0; i < kids.length; i++) {
        const age = getAge(kids[i].dob);
        if (age === null || age >= 18) {
          return `Child ${i + 1} must be under 18 years old.`;
        }
      }
    }

    if (type === "Family One Adult") {
      if (adults.length !== 1) {
        return "One Adult + Children membership requires 1 adult.";
      }

      const age = getAge(adults[0]?.dob);
      if (age === null || age < 18) {
        return "The adult must be at least 18 years old.";
      }

      for (let i = 0; i < kids.length; i++) {
        const childAge = getAge(kids[i].dob);
        if (childAge === null || childAge >= 18) {
          return `Child ${i + 1} must be under 18 years old.`;
        }
      }
    }

    if (type === "Single Adult Membership") {
      if (adults.length !== 1) {
        return "Single Adult Membership requires 1 adult.";
      }

      const age = getAge(adults[0]?.dob);
      if (age === null || age < 18) {
        return "Single Adult Membership requires age 18 or above.";
      }
    }

    if (type === "Senior Single Membership") {
      if (adults.length !== 1) {
        return "Senior Single Membership requires 1 adult.";
      }

      const age = getAge(adults[0]?.dob);
      if (age === null || age < 65) {
        return "Senior Single Membership requires age 65 or above.";
      }
    }

    if (type === "Senior Couple Membership") {
      if (adults.length !== 2) {
        return "Senior Couple Membership requires 2 adults.";
      }

      const ages = adults.map((adult) => getAge(adult.dob));

      if (ages.some((age) => age === null)) {
        return "Please enter valid birthdates for both adults.";
      }

      const hasSenior = ages.some((age) => age >= 65);
      if (!hasSenior) {
        return "Senior Couple Membership requires at least one spouse to be 65 or older.";
      }
    }

    if (type === "Student Membership") {
      if (adults.length !== 1) {
        return "Student Membership requires 1 applicant.";
      }

      const age = getAge(adults[0]?.dob);
      if (age === null || age < 18 || age > 24) {
        return "Student Membership is only for ages 18 to 24.";
      }

      const idProof = adults[0]?.idProof;
      const studentProof = adults[0]?.studentIdProof;

      if (!idProof) {
        return "Government-issued ID is required for Student Membership.";
      }

      if (!studentProof) {
        return "Student proof is required for Student Membership.";
      }
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accountHolder?.id && !accountHolder?.member_id) {
      alert("Please login again. Member account not found.");
      return;
    }

    if (!formData.membershipType) {
      alert("Please select a membership type.");
      return;
    }

    const isBasicValid = validateBasicFields();
    if (!isBasicValid) {
      alert("Please correct the highlighted fields.");
      return;
    }

    const validationError = validateMembershipRules();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const memberId = Number(accountHolder.id || accountHolder.member_id);

      const fd = new FormData();
      fd.append("member_id", String(memberId));
      fd.append("membership_type", formData.membershipType);
      fd.append("notes", formData.message || "");
      fd.append("main_contact_name", formData.mainContactName || "");
      fd.append("email", formData.email || "");
      fd.append("phone", formData.phone || "");

      if (editMode && applicationId) {
        fd.append("id", String(applicationId));
      }

      fd.append("adults", JSON.stringify(formData.adults || []));
      fd.append("kids", JSON.stringify(formData.kids || []));

      (formData.adults || []).forEach((adult, index) => {
        if (adult.idProof instanceof File) {
          fd.append(`adult_idProof_${index}`, adult.idProof);
        }

        if (adult.studentIdProof instanceof File) {
          fd.append(`adult_studentIdProof_${index}`, adult.studentIdProof);
        }
      });

      const endpoint = editMode
        ? "updateMembershipApplication.php"
        : "createMembershipApplication.php";

      const result = await api.post(endpoint, fd);

      if (result?.success) {
        alert(
          editMode
            ? "Membership application updated successfully."
            : "Membership application submitted successfully."
        );
        navigate("/membershipdashboard");
      } else {
        console.log("API result:", result);
        alert(result?.message || "Failed to save membership application.");
      }
    } catch (error) {
      console.error("Membership submit error:", error);
      alert(error.message || "Something went wrong while saving the application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-brand mb-2">
            {editMode ? "Edit Membership Application" : "Membership Application"}
          </h1>
          <p className="text-gray-600">
            {editMode
              ? "Update your membership application details below."
              : "Create a membership application under your account."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Main Contact Name
              </label>
              <input
                type="text"
                name="mainContactName"
                value={formData.mainContactName}
                onChange={handleBasicChange}
                required
                placeholder="First Name Last Name"
                className={inputClass(!!errors.mainContactName)}
              />
              {errors.mainContactName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.mainContactName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleBasicChange}
                required
                className={inputClass(!!errors.email)}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleBasicChange}
                required
                maxLength={10}
                inputMode="numeric"
                placeholder="10-digit phone number"
                className={inputClass(!!errors.phone)}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Membership Type
              </label>
              <input
                type="text"
                value={currentConfig?.label || formData.membershipType}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {pricingLoading && (
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
              <p className="text-gray-600">Loading pricing...</p>
            </div>
          )}

          {pricingError && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-red-700">{pricingError}</p>
            </div>
          )}

          {membershipTypeDetails && !pricingLoading && !pricingError && (
            <div className="rounded-xl bg-green-50 border border-green-200 p-4">
              <p className="text-green-800 font-semibold mb-2">
                Selected: {membershipTypeDetails.name}
              </p>

              {membershipTypeDetails.is_discount_active ? (
                <>
                  <p className="text-sm text-gray-400 line-through">
                    ${Number(membershipTypeDetails.base_price).toFixed(2)}
                  </p>
                  <p className="text-sm text-red-600 font-medium">
                    {membershipTypeDetails.price_label}
                  </p>
                  <p className="text-lg font-bold text-green-700 mt-1 flex items-center gap-2">
                    <span className="bg-green-600 text-white rounded-full px-2 text-xs">
                      ✓
                    </span>
                    ${Number(membershipTypeDetails.final_price).toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="text-lg font-bold text-green-700">
                  ${Number(membershipTypeDetails.base_price).toFixed(2)}
                </p>
              )}
            </div>
          )}

          {formData.adults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-brand">Adult Details</h2>

              {formData.adults.map((adult, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-4"
                >
                  <h3 className="font-semibold text-gray-800">
                    {formData.adults.length === 1
                      ? "Adult Applicant"
                      : `Adult ${index + 1}`}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="First Name Last Name"
                        value={adult.fullName}
                        onChange={(e) =>
                          updateAdult(index, "fullName", e.target.value)
                        }
                        required
                        className={inputClass(!!errors.adults?.[index]?.fullName)}
                      />
                      {errors.adults?.[index]?.fullName && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.adults[index].fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="date"
                        value={adult.dob}
                        onChange={(e) => updateAdult(index, "dob", e.target.value)}
                        required
                        className={inputClass(!!errors.adults?.[index]?.dob)}
                      />
                      {errors.adults?.[index]?.dob && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.adults[index].dob}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="tel"
                        placeholder="10-digit phone number"
                        value={adult.phone}
                        onChange={(e) =>
                          updateAdult(index, "phone", e.target.value)
                        }
                        required
                        maxLength={10}
                        inputMode="numeric"
                        className={inputClass(!!errors.adults?.[index]?.phone)}
                      />
                      {errors.adults?.[index]?.phone && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.adults[index].phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Relation to Account Holder"
                        value={adult.relation}
                        onChange={(e) =>
                          updateAdult(index, "relation", e.target.value)
                        }
                        required
                        className={inputClass(!!errors.adults?.[index]?.relation)}
                      />
                      {errors.adults?.[index]?.relation && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.adults[index].relation}
                        </p>
                      )}
                    </div>
                  </div>

                  {formData.membershipType === "Student Membership" &&
                    index === 0 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Government ID
                          </label>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) =>
                              updateAdult(
                                index,
                                "idProof",
                                e.target.files?.[0] || null
                              )
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
                          />
                          {typeof adult.idProof === "string" && adult.idProof && (
                            <p className="text-xs text-gray-500 mt-1">
                              Current file: {adult.idProof}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Student Proof
                          </label>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) =>
                              updateAdult(
                                index,
                                "studentIdProof",
                                e.target.files?.[0] || null
                              )
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
                          />
                          {typeof adult.studentIdProof === "string" &&
                            adult.studentIdProof && (
                              <p className="text-xs text-gray-500 mt-1">
                                Current file: {adult.studentIdProof}
                              </p>
                            )}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}

          {(formData.membershipType === "Family Membership" ||
            formData.membershipType === "Family One Adult") && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-brand">
                    Children Details
                  </h2>
                  <button
                    type="button"
                    onClick={addChild}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                  >
                    Add Child
                  </button>
                </div>

                {formData.kids.map((child, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">
                        Child {index + 1}
                      </h3>


                      <button
                        type="button"
                        onClick={() => removeChild(index)}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          placeholder="First Name Last Name"
                          value={child.fullName}
                          onChange={(e) =>
                            updateChild(index, "fullName", e.target.value)
                          }
                          required
                          className={inputClass(!!errors.kids?.[index]?.fullName)}
                        />
                        {errors.kids?.[index]?.fullName && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.kids[index].fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <input
                          type="date"
                          value={child.dob}
                          onChange={(e) => updateChild(index, "dob", e.target.value)}
                          required
                          className={inputClass(!!errors.kids?.[index]?.dob)}
                        />
                        {errors.kids?.[index]?.dob && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.kids[index].dob}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Message or Notes
            </label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleBasicChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Optional notes for this membership application"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate("/membershipdashboard")}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Back to Dashboard
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:flex-1 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-300 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-lg"
            >
              {submitting
                ? editMode
                  ? "Updating..."
                  : "Submitting..."
                : editMode
                  ? "Update Membership Application"
                  : "Submit Membership Application"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}