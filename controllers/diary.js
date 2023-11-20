const Diary = require("../models/Diary");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllDiary = async (req, res) => {
  const diary = await Diary.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ diary, count: diary.length });
};

const addDiary = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const diary = await Diary.create(req.body);
  res.status(StatusCodes.CREATED).json({ diary });
};

const getOneDiary = async (req, res) => {
  const {
    user: { userId },
    params: { id: diaryId },
  } = req;

  const diary = await Diary.findOne({ _id: diaryId, createdBy: userId });

  if (!diary) {
    throw new NotFoundError(`No Diary with id:${diaryId}`);
  }

  res.status(StatusCodes.OK).json(diary);
};

const updateDiary = async (req, res) => {
  const {
    body: { title, content, date },
    user: { userId },
    params: { id: diaryId },
  } = req;

  if (!title || !content) {
    throw new BadRequestError("Title or content cannot be empty");
  }

  const diary = await Diary.findByIdAndUpdate(
    { _id: diaryId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!diary) {
    throw new NotFoundError(`No diary found id:${diaryId}`);
  }

  res.status(StatusCodes.OK).json({ diary });
};

const deleteDiary = async (req, res) => {
  const {
    user: { userId },
    params: { id: diaryId },
  } = req;

  const diary = await Diary.findByIdAndDelete({
    _id: diaryId,
    createdBy: userId,
  });

  if (!diary) {
    throw new NotFoundError(`No Diary with id:${diary}`);
  }

  res.status(StatusCodes.OK).json({ msg: "Success" });
};

module.exports = {
  getAllDiary,
  addDiary,
  getOneDiary,
  updateDiary,
  deleteDiary,
};
