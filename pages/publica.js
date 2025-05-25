import { useState, useRef } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { slug, getFormattedDate } from "@utils/helpers";
import {
  DatePicker,
  Input,
  Select,
  TextArea,
  ImageUpload,
} from "@components/ui/common/form";
import Meta from "@components/partials/seo-meta";

const Notification = dynamic(
  () => import("@components/ui/common/notification"),
  {
    loading: () => "",
  }
);

const defaultForm = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  location: "",
  frequency: "",
  imageUploaded: false,
};

const _createFormState = (
  isDisabled = true,
  isPristine = true,
  message = ""
) => ({
  isDisabled,
  isPristine,
  message,
});

const createFormState = (
  { title, description, startDate, endDate, location },
  isPristine
) => {
  if (!isPristine) {
    return _createFormState(true, true, "");
  }

  if (!title || title.length < 10) {
    return _createFormState(true, true, "Títol obligatori, mínim 10 caràcters");
  }

  if (!description.replace(/(<([^>]+)>)/gi, "") || description.length < 15) {
    return _createFormState(
      true,
      true,
      "Descripció obligatòria, mínim 15 caràcters"
    );
  }

  if (!location) {
    return _createFormState(true, true, "Lloc obligatori");
  }

  if (!startDate) {
    return _createFormState(true, true, "Data inici obligatòria");
  }

  if (!endDate) {
    return _createFormState(true, true, "Data final obligatòria");
  }

  if (endDate.getTime() <= startDate.getTime()) {
    return _createFormState(
      true,
      true,
      "Data final no pot ser anterior o igual a la data inici"
    );
  }

  return _createFormState(false);
};

// Helper function for client-side image resizing
async function resizeImageFile(
  file,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.85
) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Output as JPEG for better compression for photos/posters
      const resizedImageDataUrl = canvas.toDataURL("image/jpeg", quality);
      const base64Data = resizedImageDataUrl.split(",")[1];

      URL.revokeObjectURL(img.src); // Clean up object URL

      resolve({
        base64Data,
        imageType: "image/jpeg", // Output type is JPEG
      });
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(img.src); // Clean up object URL on error
      reject(
        new Error(
          `[RESIZE_IMG_ONERROR] Failed to load image for resizing: ${
            error.message || error.type || "Unknown image load error"
          }`
        )
      );
    };
  });
}

// ---- START: ADDED FOR LOCALSTORAGE RATE LIMITING ----
const MAX_AI_CALLS_PER_DAY = 3;
const AI_ANALYSIS_USAGE_KEY = "aiAnalysisUsage"; // Key for localStorage

function getCurrentDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
// ---- END: ADDED FOR LOCALSTORAGE RATE LIMITING ----

export default function Publica() {
  const router = useRouter();
  const [form, setForm] = useState(defaultForm);
  const [formState, setFormState] = useState(_createFormState());
  const [isLoading, setIsLoading] = useState(false);
  const [imageToUpload, setImageToUpload] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [imageAnalyzed, setImageAnalyzed] = useState(false);
  const [showAiWarning, setShowAiWarning] = useState(false);
  const titleInputRef = useRef(null);

  const showFormAndScroll = () => {
    setFormVisible(true);
    // Scroll after a short delay to allow the form to render
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  const handleFormChange = (name, value) => {
    const newForm = { ...form, [name]: value };

    setForm(newForm);
    setFormState(createFormState(newForm, false)); // Set isPristine to false to trigger validation
  };

  const handleChange = ({ target: { name, value } }) =>
    handleFormChange(name, value);

  const handleChangeDate = (name, value) => handleFormChange(name, value);

  const handleChangeLocation = ({ value }) =>
    handleFormChange("location", value);

  const handleImageUpload = (file) => {
    setImageToUpload(file);
    setImageAnalyzed(false);
    setShowAiWarning(false);
    setFormVisible(false);
    setAnalysisError(null);
  };

  const handleAnalyzeImage = async () => {
    if (!imageToUpload) {
      setAnalysisError("Si us plau, puja una imatge primer.");
      return;
    }

    setFormVisible(false);
    const currentDate = getCurrentDateString();
    let usageData = { date: currentDate, count: 0 };

    try {
      const storedUsage = localStorage.getItem(AI_ANALYSIS_USAGE_KEY);
      if (storedUsage) {
        const parsedUsage = JSON.parse(storedUsage);
        if (parsedUsage.date === currentDate) {
          usageData = parsedUsage;
        } else {
          usageData.count = 0;
          usageData.date = currentDate;
        }
      }
    } catch (e) {
      console.error(
        "Error reading or parsing AI analysis usage from localStorage:",
        e
      );
      usageData = { date: currentDate, count: 0 };
    }

    if (usageData.count >= MAX_AI_CALLS_PER_DAY) {
      setAnalysisError(
        `Has assolit el límit diari de ${MAX_AI_CALLS_PER_DAY} anàlisis d'imatges amb IA. Prova-ho de nou demà.`
      );
      setIsAnalyzingImage(false);
      showFormAndScroll();
      return;
    }

    // Increment count and update localStorage *before* starting the analysis process
    usageData.count += 1;
    try {
      localStorage.setItem(AI_ANALYSIS_USAGE_KEY, JSON.stringify(usageData));
    } catch (e) {
      console.error("Error saving AI analysis usage to localStorage:", e);
      // If localStorage fails, the app will continue to function, but rate limiting might not be perfect
    }

    setIsAnalyzingImage(true);
    setAnalysisError(null);

    try {
      // Resize the image first
      const { base64Data, imageType } = await resizeImageFile(imageToUpload);

      const response = await fetch("/api/analyzeImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: base64Data,
          imageType: imageType, // Use the type from the resized image (likely image/jpeg)
        }),
      });

      if (!response.ok) {
        let errorDetail = `API request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorDetail = errorData.error;
          } else if (errorData) {
            errorDetail = `API error: ${JSON.stringify(errorData)}`;
          }
        } catch (jsonError) {
          try {
            const textError = await response.text();
            errorDetail = `API request failed with status ${
              response.status
            }. Response was not JSON: ${textError.substring(0, 200)}...`;
          } catch (textParseError) {
            errorDetail = `API request failed with status ${response.status}. Response was not JSON and could not be read as text.`;
          }
        }
        throw new Error(errorDetail);
      }

      const data = await response.json();

      const parsedStartDate = data.startDate
        ? new Date(data.startDate.replace("T", " "))
        : form.startDate;
      const parsedEndDate = data.endDate
        ? new Date(data.endDate.replace("T", " "))
        : form.endDate;

      // Check if AI returned any meaningful data
      if (
        !data.title &&
        !data.description &&
        !data.location &&
        !data.startDate // We check data.startDate, not parsedStartDate which might have a fallback
      ) {
        setAnalysisError(
          "L'IA no ha pogut extreure informació d'esdeveniment d'aquesta imatge. És possible que no sigui un cartell d'un acte cultural o la imatge no sigui prou clara. Pots emplenar les dades manualment."
        );
        setShowAiWarning(false);
        // Still set the form with whatever (likely empty) data came back, so it's consistent
        const newForm = {
          ...form,
          title: data.title || "",
          description: data.description || "",
          location: data.location || "",
          startDate: parsedStartDate || null, // Ensure it can be null
          endDate: parsedEndDate || null, // Ensure it can be null
        };
        setForm(newForm);
        setFormState(createFormState(newForm, false)); // Validate the (potentially empty) form
      } else {
        // AI returned some data, proceed as before
        const newForm = {
          ...form,
          title: data.title || form.title,
          description: data.description || form.description,
          location: data.location || form.location,
          startDate: parsedStartDate,
          endDate: parsedEndDate,
        };
        setForm(newForm);
        setFormState(createFormState(newForm, false));
        setShowAiWarning(true); // Show AI warning after successful analysis with data
        setAnalysisError(null); // Clear any previous error
      }

      setImageAnalyzed(true); // Image has been processed, regardless of data found
      showFormAndScroll();
    } catch (error) {
      setAnalysisError(
        `[HANDLE_ANALYZE_IMAGE_CATCH] ${
          error.message || "Hi ha hagut un error analitzant la imatge."
        }`
      );
      showFormAndScroll();
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleSkipAnalysis = () => {
    setForm(defaultForm); // Reset to default form if skipping
    setImageAnalyzed(false); // No analysis performed
    setShowAiWarning(false);
    setAnalysisError(null);
    setImageToUpload(null); // Clear any uploaded image if skipping
    showFormAndScroll();
  };

  const goToEventPage = (url) => ({
    pathname: `${url}`,
    query: { newEvent: true },
  });

  const onSubmit = async () => {
    const newFormState = createFormState(
      form,
      formState.isPristine,
      null,
      true
    );

    setFormState(newFormState);

    if (!newFormState.isDisabled) {
      setIsLoading(true);

      const rawResponse = await fetch(process.env.NEXT_PUBLIC_CREATE_EVENT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, imageUploaded: !!imageToUpload }),
      });
      const { id } = await rawResponse.json();

      const { formattedStart } = getFormattedDate(form.startDate, form.endDate);
      const slugifiedTitle = slug(form.title, formattedStart, id);

      imageToUpload
        ? uploadFile(id, slugifiedTitle)
        : router.push(goToEventPage(`/${slugifiedTitle}`));
    }
  };

  const uploadFile = (id, slugifiedTitle) => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME}/upload`;
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xhr.upload.addEventListener("progress", (e) => {
      setProgress(Math.round((e.loaded * 100.0) / e.total));
    });

    xhr.onreadystatechange = (e) => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        const public_id = JSON.parse(xhr.responseText).public_id;
        console.log(public_id);
        router.push(goToEventPage(`/${slugifiedTitle}`));
      }
    };

    fd.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET
    );
    fd.append("tags", "browser_upload");
    fd.append("file", imageToUpload);
    fd.append("public_id", id);
    xhr.send(fd);
  };

  return (
    <>
      <Meta
        title="Publica un acte cultural - Cultura Cardedeu"
        description="Publica un acte cultural a l'agenda de Cardedeu. Omple el formulari per donar a conèixer el teu esdeveniment."
        canonical="https://www.culturacardedeu.com/publica"
      />
      <div className="space-y-8 divide-y divide-gray-200 max-w-3xl mx-auto">
        {/* Section for Image Upload and Action Buttons - Always Visible */}
        <div className="pt-8">
          {" "}
          {/* This pt-8 matches the original structure for this section */}
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {" "}
            {/* This structure also matches */}
            <ImageUpload
              value={imageToUpload}
              onUpload={handleImageUpload}
              progress={progress}
            />
            <div className="sm:col-span-6 mt-4">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleAnalyzeImage}
                  disabled={
                    !imageToUpload ||
                    isLoading ||
                    isAnalyzingImage ||
                    imageAnalyzed
                  }
                  className="disabled:opacity-50 disabled:cursor-default disabled:hover:bg-gray-700 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
                >
                  {isAnalyzingImage
                    ? "Analitzant..."
                    : "Analitza Imatge amb IA"}
                </button>
                <button
                  type="button"
                  onClick={handleSkipAnalysis}
                  disabled={isLoading || isAnalyzingImage}
                  className="disabled:opacity-50 disabled:cursor-default disabled:hover:bg-gray-100 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
                >
                  Omet Anàlisi i Emplena Manualment
                </button>
              </div>
            </div>
          </div>
        </div>

        {formVisible && (
          <div ref={titleInputRef}>
            {analysisError && (
              <Notification
                type="error"
                customNotification={false}
                hideNotification={() => setAnalysisError(null)}
                title="Error en l'Anàlisi de la Imatge"
                message={analysisError}
              />
            )}
            {showAiWarning && !analysisError && (
              <Notification
                type="warning"
                customNotification={false}
                hideNotification={() => setShowAiWarning(false)}
                title="Revisa les Dades Emplenades per l'IA"
                message="L'IA pot cometre errors. Si us plau, revisa acuradament tots els camps abans de publicar l'esdeveniment."
              />
            )}
            <div className="space-y-8 divide-y divide-gray-200">
              <div className="pt-8">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Publica un acte cultural
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    * camps obligatoris
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <Input
                    id="title"
                    title="Títol *"
                    value={form.title}
                    onChange={handleChange}
                  />
                  <TextArea
                    id="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                  <Select
                    id="location"
                    value={form.location}
                    title="Localització *"
                    onChange={handleChangeLocation}
                  />
                  {formVisible && (
                    <DatePicker
                      key={`${
                        form.startDate instanceof Date
                          ? form.startDate.getTime()
                          : "start-null"
                      }-${
                        form.endDate instanceof Date
                          ? form.endDate.getTime()
                          : "end-null"
                      }`}
                      initialStartDate={
                        form.startDate instanceof Date ? form.startDate : null
                      }
                      initialEndDate={
                        form.endDate instanceof Date ? form.endDate : null
                      }
                      onChange={handleChangeDate}
                    />
                  )}
                </div>
              </div>
            </div>

            {formState.isPristine && formState.message && (
              <div className="p-4 my-3 text-red-700 bg-red-200 rounded-lg text-sm">
                {formState.message}
              </div>
            )}

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  disabled={isLoading}
                  onClick={onSubmit}
                  className="disabled:opacity-50 disabled:cursor-default disabled:hover:bg-[#ECB84A] ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ECB84A] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <svg
                        role="status"
                        className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="#1C64F2"
                        />
                      </svg>
                      Publicant ...
                    </>
                  ) : (
                    "Publica"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
