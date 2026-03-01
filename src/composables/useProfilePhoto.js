import { ref } from "vue";

const profilePhoto = ref("/blankprofpic.png");

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    profilePhoto.value = URL.createObjectURL(file);
  }
}

function openFileDialog() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", handlePhotoUpload);
  input.click();
}

export function useProfilePhoto() {
  return {
    profilePhoto,
    handlePhotoUpload,
    openFileDialog,
  };
}
