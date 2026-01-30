'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Define a Zod schema for validation
const uploadSchema = z.object({
  name: z.string().min(3, { message: 'Real Name is required and must be at least 3 characters.' }),
  artistName: z.string().min(3, { message: 'Artist Name is required and must be at least 3 characters.' }),
  emailAddress: z.string().email({ message: 'Invalid email address.' }),
  phoneNumber: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Please select a valid gender.' }),
  country: z.string().min(2, { message: 'Country is required.' }),
  // For file uploads, you'd typically handle them separately or use a library that integrates with Zod
  // For simplicity, we'll omit direct file validation in Zod here, but mention how to handle it.
});

export async function uploadMusic(prevState: any, formData: FormData) {
  console.log('Server Action received formData:', formData);

  const rawFormData = {
    name: formData.get('name'),
    artistName: formData.get('artistName'),
    emailAddress: formData.get('emailAddress'),
    phoneNumber: formData.get('phoneNumber'),
    gender: formData.get('gender'),
    country: formData.get('country'),
    // Files would be handled here:
    // audioFile: formData.get('audioFile'),
    // coverArt: formData.get('coverArt'),
  };

  // Validate the form data
  const validatedFields = uploadSchema.safeParse(rawFormData);

  // Return errors if validation fails
  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    console.error('Validation Errors:', fieldErrors);
    return {
      message: 'Validation Failed',
      errors: fieldErrors,
    };
  }

  // Destructure validated data
  const { name, artistName, emailAddress, phoneNumber, gender, country } = validatedFields.data;

  // --- File Upload Handling (Conceptual) ---
  const audioFile = formData.get('audioFile') as File | null;
  const coverArt = formData.get('coverArt') as File | null;

  if (audioFile && audioFile.size > 0) {
    // In a real application, you would upload this to a cloud storage service
    // like AWS S3, Cloudinary, or your own server's file system.
    // Example:
    // const audioUploadResult = await uploadFileToS3(audioFile);
    console.log(`Processing audio file: ${audioFile.name}, size: ${audioFile.size} bytes`);
  } else {
    return {
      message: 'Audio file is required.',
      errors: { audioFile: ['Audio file is required.'] },
    };
  }

  if (coverArt && coverArt.size > 0) {
    // Similar to audio file, upload cover art
    console.log(`Processing cover art: ${coverArt.name}, size: ${coverArt.size} bytes`);
  } else {
    return {
      message: 'Cover art is required.',
      errors: { coverArt: ['Cover art is required.'] },
    };
  }
  // --- End File Upload Handling ---

  // Simulate a database save
  try {
    // Replace with your actual database insertion logic
    console.log('Saving music data to database...');
    console.log({
      name,
      artistName,
      emailAddress,
      phoneNumber,
      gender,
      country,
      // You'd store file URLs after successful upload
      audioFileUrl: 'https://example.com/audio/uploaded_song.mp3',
      coverArtUrl: 'https://example.com/images/uploaded_cover.jpg',
    });

    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

    // If successful, revalidate relevant paths and redirect
    revalidatePath('/discover/me'); // Revalidate user's tracks page
    redirect('/discover/me?uploadSuccess=true'); // Redirect on success
  } catch (error) {
    console.error('Database save failed:', error);
    return {
      message: 'Failed to upload music. Please try again.',
      errors: { general: ['An unexpected error occurred.'] },
    };
  }
}