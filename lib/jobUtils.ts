export async function extractJobInfo(content: string) {
  const urlMatch = content.match(/https?:\/\/[^\s]+/)
  if (!urlMatch) {
    return null
  }

  const url = urlMatch[0]

  try {
    const response = await fetch(url)
    const html = await response.text()

    // Create a DOM parser
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    // Extract job information
    const title = doc.querySelector("h1")?.textContent || "Job Title Not Found"
    const company = doc.querySelector(".company-name")?.textContent || "Company Not Found"
    const location = doc.querySelector(".location")?.textContent || "Location Not Found"
    const description = doc.querySelector(".job-description")?.textContent || "Description Not Found"

    // Try to find an image (logo)
    const image = doc.querySelector(".company-logo img")?.getAttribute("src") || "/placeholder.svg"

    return {
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      description: description.trim().substring(0, 200) + "...", // Truncate description
      image: image.startsWith("http") ? image : `https://hrmos.co${image}`,
      url,
    }
  } catch (error) {
    console.error("Error fetching job info:", error)
    return null
  }
}

