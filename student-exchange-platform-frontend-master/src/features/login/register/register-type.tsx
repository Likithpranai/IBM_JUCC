import { StudyLevelType } from "../../../api/api-types";

export enum ProfileType {
    Student = "Student",
    SchoolAdmin = "SchoolAdmin",
}

export interface RegisterProfileData {
    profileType: ProfileType;
    username: string;
    email: string;
    password: string;
}

export interface StudentSpecificInfo {
    major: string;
    studyLevel: StudyLevelType | null;
    gpa: number | null;
    courseInterests: string;
    schoolPreferences: string;
    targetCountries: string[];
}

export interface StudentData {
    firstName: string;
    lastName: string;
    homeUniversity: string;

    major: string;
    studyLevel: StudyLevelType;
    gpa: number;
    courseInterests: string[];
    schoolPreferences: string[];
    targetCountries: string[];
}

export interface SchoolAdminData {
    university: string,
}

