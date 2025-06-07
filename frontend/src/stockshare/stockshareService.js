import api from '../services/api';

export const createListing = (listingData) => {
  return api.post('/stockshare/list', listingData);
};

export const getAllListings = () => {
  return api.get('/stockshare/listings');
};

export const getMyListings = () => {
  return api.get('/stockshare/my-listings');
};

export const updateMyListing = (listingId, listingData) => {
  return api.put(`/stockshare/listings/${listingId}`, listingData);
};

export const deleteMyListing = (listingId) => {
  return api.delete(`/stockshare/listings/${listingId}`);
};