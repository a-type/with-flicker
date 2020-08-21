/**
 * This module is the kind of thing I'd normally start with when building
 * out a client to interact with an external API - unless the vendor offered
 * their own SDK. Just gradually build out functionality with an intuitive
 * API, not getting too attached to usages until patterns begin to develop.
 */

export type PhotoData = {
  id: string;
  owner: string;
  secret: string;
  server: string;
  title: string;
  farm: number;
};

export async function searchPhotos({
  text,
  page = 1,
}: {
  text: string;
  page?: number;
}) {
  // call Flickr API to fetch image data - gotta say, their response is a little odd.
  // nojsoncallback is required to actually return... valid JSON.
  const response = await fetch(
    `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.REACT_APP_FLICKR_API_KEY}&text=${text}&page=${page}&per_page=50&format=json&nojsoncallback=1&safe_search=1`,
  );

  if (!response.ok) {
    // TODO; surface to user
    const text = await response.text();
    console.error(`Flickr API error`, response.status, text);
    throw new Error('Bad response from Flickr API');
  }

  const body = await response.json();
  return body.photos as {
    page: number;
    pages: number;
    photo: PhotoData[];
  };
}
