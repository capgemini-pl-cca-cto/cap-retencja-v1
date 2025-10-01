import { jsPDF } from 'jspdf';

export interface FontConfig {
  name: string;
  fontPath: string;
  fontFamily: string;
  fontStyle: 'normal' | 'bold';
}

export async function loadCustomFont(
  doc: jsPDF,
  fontConfig: FontConfig,
): Promise<void> {
  try {
    // Load the font file as binary data
    const response = await fetch(fontConfig.fontPath);

    if (!response.ok) {
      throw new Error(
        `Failed to load font: ${response.status} ${response.statusText}`,
      );
    }

    // Convert to array buffer then to binary string
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let binaryString = '';

    // Convert Uint8Array to binary string
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }

    // Add the font to jsPDF
    doc.addFileToVFS(fontConfig.name, binaryString);
    doc.addFont(fontConfig.name, fontConfig.fontFamily, fontConfig.fontStyle);
  } catch (error) {
    console.error('Error loading custom font:', error);
    throw error;
  }
}

/**
 * Default font configuration for Polish character support
 */
export const DEFAULT_POLISH_FONT: FontConfig = {
  name: 'Roboto-Regular.ttf',
  fontPath: 'assets/Roboto-Regular.ttf',
  fontFamily: 'Roboto',
  fontStyle: 'normal',
};

/**
 * Bold font configuration using Roboto-Bold for headings
 */
export const ROBOTO_BOLD_FONT: FontConfig = {
  name: 'Roboto-Bold.ttf',
  fontPath: 'assets/Roboto-Bold.ttf',
  fontFamily: 'Roboto',
  fontStyle: 'bold',
};

/**
 * Sets up jsPDF with both regular and bold Polish font support
 * @param doc - jsPDF instance
 * @param regularFont - Regular font configuration (defaults to Roboto)
 * @param boldFont - Bold font configuration (defaults to Roboto-Bold)
 * @returns Promise that resolves when both fonts are ready to use
 */
export async function setupPolishFonts(
  doc: jsPDF,
  regularFont: FontConfig = DEFAULT_POLISH_FONT,
  boldFont: FontConfig = ROBOTO_BOLD_FONT,
): Promise<void> {
  await Promise.all([
    loadCustomFont(doc, regularFont),
    loadCustomFont(doc, boldFont),
  ]);
  // Set the regular font as default
  doc.setFont(regularFont.fontFamily, regularFont.fontStyle);
}
