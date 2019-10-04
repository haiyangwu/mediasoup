#ifndef TREND_CALCULATOR_HPP
#define TREND_CALCULATOR_HPP

#include "common.hpp"

namespace RTC
{
	class TrendCalculator
	{
	public:
		TrendCalculator();

	public:
		uint32_t GetValue() const;
		void Update(uint32_t value, uint64_t nowMs);
		void ForceUpdate(uint32_t value, uint64_t nowMs);

	private:
		uint32_t value{ 0u };
		uint32_t highestValue{ 0u };
		uint64_t highestValueUpdatedAtMs{ 0u };
	};

	/* Inline instance methods. */

	inline uint32_t TrendCalculator::GetValue() const
	{
		return this->value;
	}
} // namespace RTC

#endif
