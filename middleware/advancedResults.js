export const advancedResults = (model, populate) => async (req, res, next) => {
  try {
    // Copy req.query to reqQuery
    const reqQuery = { ...req.query };

    // Fields to remove from reqQuery
    const fieldsToRemove = ["select", "sort", "page", "limit"];

    // Remove fields from reqQuery
    fieldsToRemove.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Add MongoDB operators ($gt, $gte, etc.)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    const queryObj = JSON.parse(queryStr);

    console.log(queryObj);
    console.log(req.user.id);

    // Find models based on query string
    let query = model.find({ ...queryObj, user: req.user.id });

    // Select specific fields
    if (req.query.select) {
      const selectedFields = req.query.select.split(",").join(" ");
      query = query.select(selectedFields);
    }

    // Sort results by field
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Count total documents
    const total = await model.countDocuments(JSON.parse(queryStr));

    // Apply pagination to query
    query = query.skip(startIndex).limit(limit);

    // Populate if needed
    if (populate) {
      query = query.populate(populate);
    }

    // Execute query
    const results = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    // Attach results to response
    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default advancedResults;
