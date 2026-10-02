ALTER TABLE "Rating"
  ADD CONSTRAINT "Rating_overall_range" CHECK ("overall" BETWEEN 1 AND 5),
  ADD CONSTRAINT "Rating_easeOfUse_range" CHECK ("easeOfUse" BETWEEN 1 AND 5),
  ADD CONSTRAINT "Rating_features_range" CHECK ("features" BETWEEN 1 AND 5),
  ADD CONSTRAINT "Rating_performance_range" CHECK ("performance" BETWEEN 1 AND 5),
  ADD CONSTRAINT "Rating_value_range" CHECK ("value" BETWEEN 1 AND 5),
  ADD CONSTRAINT "Rating_userExperience_range" CHECK ("userExperience" BETWEEN 1 AND 5);

ALTER TABLE "Review" ADD CONSTRAINT "Review_rating_range" CHECK ("rating" BETWEEN 1 AND 5);
ALTER TABLE "Report" ADD CONSTRAINT "Report_status_allowed" CHECK ("status" IN ('OPEN', 'RESOLVED'));
