export const calculateProgressBar = (data: any, inputLength: number) => {
  if (data) {
    data =  Array.isArray(data)?
      data.map((item: any) =>
        Object.fromEntries(
          Object.entries(item).filter(
            ([_, value]) => value !== "" && value !== null && value !== undefined
          )
        )
      ):
      Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value!== "" && value!== null && value!== undefined
        )
      );
    const predictLength: number = Array.isArray(data)
      ? data.length * inputLength
      : inputLength;
    const realLength: number = Array.isArray(data)
      ? data.reduce(
          (sum: number, obj: any) => (sum += Object.keys(obj).length),
          0
        )
      : Object.keys(data).length;
    return predictLength ? Math.round((realLength / predictLength) * 100) : 0;
  }
  return 0;
};
