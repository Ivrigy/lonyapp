import { axiosReq } from "../api/axiosDefaults";

export const fetchMoreData = async (resource, setResource) => {
  try {
    const { data } = await axiosReq.get(resource.next);
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      results: data.results.reduce((acc, cur) => {
        return acc.some((accResult) => accResult.id === cur.id)
          ? acc
          : [...acc, cur];
      }, prevResource.results),
    }));
  } catch (err) {}
};

export const unfollowHelper = (profile, clickedProfile) => {
  return profile.id === clickedProfile.id
    ? {
        ...profile,
        followers_count: profile.followers_count - 1,
        following_id: null,
      }
    : profile.is_owner
    ? { ...profile, following_count: profile.following_count - 1 }
    : profile;
};

export const followHelper = (profile, clickedProfile, following_id) => {
  if (profile.id === clickedProfile.id) {
    return {
      ...profile,
      followers_count: profile.followers_count + 1,
      following_id,
    };
  }
  if (profile.is_owner) {
    return { ...profile, following_count: profile.following_count + 1 };
  }
  return profile;
};
