import { Candidate } from "../CandidatesList";

export const formatNoticePeriod = (days?: string | number | null): string => {
  if (days == null || days === "") return "Not Disclosed";
  const numDays = Number(days);
  if (numDays < 30) return `${numDays} Day${numDays === 1 ? "" : "s"}`;
  const months = Math.floor(numDays / 30);
  return `${months} Month${months === 1 ? "" : "s"}`;
};

export const getExperienceDisplay = (candidateData: any): string => {
  if (candidateData.candidateDetails?.totalExperience) {
    const { year, month } = candidateData.candidateDetails.totalExperience;
    return `${year}Y ${month}M`;
  }
  if (typeof candidateData.experience === "number") return `${candidateData.experience} yrs`;
  return candidateData.exp || "-";
};

export const normalizeCandidate = (c: any): Candidate => {

  
  const qualifications: string[] = [];
  if (Array.isArray(c.userEducations)) {
    c.userEducations.forEach((edu: any) => {
      if (edu && edu.level != null) {
        qualifications.push(String(edu.level).trim());
      }
    });
  }
  if (Array.isArray(c.levels)) {
    c.levels.forEach((l: any) => {
      if (l != null) qualifications.push(String(l).trim());
    });
  }
  if (Array.isArray(c.academicDetails)) {
    c.academicDetails.forEach((a: any) => {
      const val = a.level || a.educationLevel;
      if (val != null) qualifications.push(String(val).trim());
    });
  }

  return {
    id: c._id || c.id,
    name: c.name || "-",
    profilePicture: c.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
    email: c.email,
    phone_number: c.phone_number,
    title: c.JobRole || "-",
    location: c.candidateDetails?.currentLocation || c.candidateDetails?.hometown || "-",
    experienceDisplay: getExperienceDisplay(c),
    experienceYears: typeof c.experience === "number" ? c.experience : (c.candidateDetails?.totalExperience?.year || parseInt(c.exp) || 0),
    education: c.education || c.academicDetails?.[0]?.educationLevel || "N/A",
    qualifications,
    gender: c.gender_name || c.gender || c.personalDetails?.gender || c.personalData?.gender || c.candidateDetails?.gender || "Not Disclosed",
    skills: Array.isArray(c.skills) ? c.skills : (c.personalData?.skills || []),
    match: typeof c.match === "number" ? c.match : (c.score || 0),
    noticePeriod: formatNoticePeriod(c?.employments?.[0]?.NoticePeriod),
    salary: c.salary || "N/A",
    availability: c.availability || "-",
    workMode: c.workMode || "-",
    category: c.category,
    featured: !!c.featured,
  };
};

interface FilterParams {
  searchQuery: string;
  locationQuery: string;
  experienceRange: number[];
  gender: string;
  qualification: string;
  genderData: any[];
  levelData: any[];
}

export const filterCandidate = (candidate: Candidate, filters: FilterParams): boolean => {
  const { searchQuery, locationQuery, experienceRange, gender, qualification, genderData, levelData } = filters;

  const searchLower = searchQuery.toLowerCase().trim();
  const locationLower = locationQuery.toLowerCase().trim();

  const matchesSearch = !searchLower ||
    candidate.name.toLowerCase().includes(searchLower) ||
    candidate.title.toLowerCase().includes(searchLower) ||
    candidate.skills.some((s) => s.toLowerCase().includes(searchLower));

  const matchesLocation = !locationLower || candidate.location.toLowerCase().includes(locationLower);
  const matchesExperience = candidate.experienceYears >= experienceRange[0] && candidate.experienceYears <= experienceRange[1];

  // Gender Filter
  const matchesGender = gender === "all" || (() => {
    if (!genderData || genderData.length === 0) return true;
    const selectedGenderObj = genderData.find((g) => String(g.id) === gender || g.name.toLowerCase() === gender.toLowerCase());
    if (!selectedGenderObj) return false;
    
    const candGenderVal = String(candidate.gender || "").toLowerCase().trim();
    const targetId = String(selectedGenderObj.id).toLowerCase().trim();
    const targetName = selectedGenderObj.name.toLowerCase().trim();

    return candGenderVal === targetId || candGenderVal === targetName;
  })();

  // Qualification Filter
  const matchesQualification = qualification === "all" || (() => {
    if (!levelData || levelData.length === 0) return true;
    const selectedLevelObj = levelData.find((l) => String(l.id) === qualification || l.level === qualification);
    if (!selectedLevelObj) return false;

    const targetLevelId = String(selectedLevelObj.id).trim();
    const targetLevelStr = selectedLevelObj.level.toLowerCase().trim();

    // 1. Direct ID match (e.g. String(edu.level) matches targetLevelId)
    const hasMatchingId = candidate.qualifications.includes(targetLevelId);
    if (hasMatchingId) return true;

    // 2. String name fallback check
    const hasMatchingQualName = candidate.qualifications.some((q) => {
      if (!q) return false;
      const qStr = String(q).toLowerCase().trim();
      return qStr.includes(targetLevelStr) || targetLevelStr.includes(qStr);
    });

    const matchesEduString = String(candidate.education || "").toLowerCase().trim().includes(targetLevelStr) || targetLevelStr.includes(String(candidate.education || "").toLowerCase().trim());

    return hasMatchingQualName || matchesEduString;
  })();


  return matchesSearch && matchesLocation && matchesExperience && matchesGender && matchesQualification;
};
