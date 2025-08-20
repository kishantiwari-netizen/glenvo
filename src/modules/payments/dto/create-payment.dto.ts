import {
  IsNumber,
  IsString,
  IsOptional,
  IsObject,
  Min,
  IsIn,
  IsNotEmpty,
  Matches,
} from "class-validator";

export class CreatePaymentDto {
  @IsNumber()
  @Min(0.5, { message: "Amount must be at least 0.50 for Stripe payments" })
  amount: number;

  @IsString()
  @IsIn(["USD", "EUR", "GBP", "CAD", "AUD"])
  currency: string = "USD";

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  metadata?: object;

  @IsOptional()
  @IsString()
  payment_method_id?: string;
}

export class ConfirmPaymentDto {
  @IsString()
  payment_intent_id: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Payment method ID cannot be empty if provided" })
  @Matches(/^pm_[a-zA-Z0-9]+$/, {
    message:
      "Payment method ID must be a valid Stripe payment method ID (starts with 'pm_')",
  })
  payment_method_id?: string;
}

export class CreateSubscriptionDto {
  @IsString()
  price_id: string;

  @IsOptional()
  @IsString()
  payment_method_id?: string;

  @IsOptional()
  @IsNumber()
  trial_days?: number;
}

export class CancelSubscriptionDto {
  @IsString()
  subscription_id: string;

  @IsOptional()
  cancel_at_period_end: boolean = true;
}

export class CreateRefundDto {
  @IsString()
  payment_intent_id: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @IsOptional()
  @IsString()
  @IsIn(["duplicate", "fraudulent", "requested_by_customer"])
  reason: "duplicate" | "fraudulent" | "requested_by_customer" =
    "requested_by_customer";
}
