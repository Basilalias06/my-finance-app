(function(global){
  function nonEmptyString(value){ return typeof value === 'string' && value.trim().length > 0; }
  function finiteNumber(value){ return Number.isFinite(Number(value)); }
  function isoDateLike(value){ return !value || !Number.isNaN(new Date(value).getTime()); }

  function validateTransaction(tx){
    const errors = [];
    if(!nonEmptyString(tx.n)) errors.push('Transaction name is required.');
    if(!['expense','income','transfer'].includes(tx.ty)) errors.push('Transaction type must be expense, income, or transfer.');
    if(!finiteNumber(tx.a) || Number(tx.a) < 0) errors.push('Transaction amount must be a valid positive number.');
    if(!nonEmptyString(tx.cat)) errors.push('Transaction category is required.');
    if(!nonEmptyString(tx.acc)) errors.push('Transaction account is required.');
    if(!isoDateLike(tx.d)) errors.push('Transaction date is invalid.');
    return { valid: errors.length === 0, errors };
  }

  function validateAccount(acc){
    const errors = [];
    if(!nonEmptyString(acc.name)) errors.push('Account name is required.');
    if(!finiteNumber(acc.balance)) errors.push('Account balance must be numeric.');
    return { valid: errors.length === 0, errors };
  }

  function validateBudget(b){
    const errors = [];
    if(!nonEmptyString(b.cat)) errors.push('Budget category is required.');
    if(!finiteNumber(b.limit) || Number(b.limit) < 0) errors.push('Budget limit must be zero or more.');
    if(!finiteNumber(b.spent) || Number(b.spent) < 0) errors.push('Budget spent must be zero or more.');
    return { valid: errors.length === 0, errors };
  }

  function validateGoal(g){
    const errors = [];
    if(!nonEmptyString(g.name)) errors.push('Goal name is required.');
    if(!finiteNumber(g.target) || Number(g.target) <= 0) errors.push('Goal target must be greater than zero.');
    if(!finiteNumber(g.saved) || Number(g.saved) < 0) errors.push('Goal saved amount must be zero or more.');
    return { valid: errors.length === 0, errors };
  }

  function validateDebt(d){
    const errors = [];
    if(!nonEmptyString(d.name)) errors.push('Debt name is required.');
    if(!finiteNumber(d.outstanding) || Number(d.outstanding) < 0) errors.push('Outstanding debt must be zero or more.');
    return { valid: errors.length === 0, errors };
  }

  function validateSplit(s){
    const errors = [];
    if(!nonEmptyString(s.desc)) errors.push('Split description is required.');
    if(!finiteNumber(s.total) || Number(s.total) <= 0) errors.push('Split total must be greater than zero.');
    if(!Array.isArray(s.members) || s.members.length < 2) errors.push('Split must include at least two members.');
    return { valid: errors.length === 0, errors };
  }

  function validateImportShape(data){
    const errors = [];
    if(!data || typeof data !== 'object') errors.push('Import must be a JSON object.');
    if(data && data.schemaVersion && typeof data.schemaVersion !== 'number') errors.push('schemaVersion must be numeric when provided.');
    return { valid: errors.length === 0, errors };
  }

  global.FTValidate = {
    transaction: validateTransaction,
    account: validateAccount,
    budget: validateBudget,
    goal: validateGoal,
    debt: validateDebt,
    split: validateSplit,
    importShape: validateImportShape,
  };
})(window);
