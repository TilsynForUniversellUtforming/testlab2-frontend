const useFormatDate = (dateString: string) => {
  if (typeof dateString !== 'undefined' && dateString !== null) {
    return new Date(dateString).toLocaleDateString('no');
  }
};

export default useFormatDate;
