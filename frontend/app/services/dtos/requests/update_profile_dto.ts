export interface UpdateProfileDTO {
  id: number;
  username: string;
  phoneNumber: string;
  imagePath?: string | File;
}
