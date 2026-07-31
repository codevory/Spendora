export function validateSort(sort:string | undefined) {
  let sort_varLowerCase =
    sort !== undefined ? sort.toString().toLowerCase() : "desc";
  let sort_varUpperCase =
    sort !== undefined ? sort.toString().toUpperCase() : "DESC";

  if (sort_varLowerCase === "desc" || sort_varLowerCase === "asc") {
    return sort_varLowerCase;

  } else if (sort_varUpperCase === "DESC" || sort_varUpperCase === "ASC") {
    return sort_varUpperCase;
  }

  return "desc";
}

export function validateLimit(limit:number | string | undefined) {
  let data_limit = limit !== undefined ? Math.min(Number(limit), 250) : 250;

  if(!limit || isNaN(data_limit) || data_limit < 0){
    return 250
  }
  return data_limit  
}