"use client";

import React, { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  getCountryData,
  ICountryData,
  getCountryDataList,
  getEmojiFlag,
} from "countries-list";
import { RxCaretSort } from "react-icons/rx";
import * as PhoneNumber from "libphonenumber-js";
import { phone as _phone } from "phone";

const formSchema = z.object({
  phone: z.string().min(2, {
    message: "Phone number is required",
  }),
});

function isPhoneNumberValid(
  phoneNumber: string,
  countryCode: PhoneNumber.CountryCode
) {
  try {
    const parsedNumber = PhoneNumber.parse(phoneNumber, countryCode);
    return PhoneNumber.isValidNumber(parsedNumber);
  } catch (error) {
    return false;
  }
}

function formatPhoneNumber(
  number: string,
  countryCode: PhoneNumber.CountryCode
) {
  try {
    const phoneNumber = PhoneNumber.parsePhoneNumber(number, countryCode);
    const isPhoneNumberValid_ = isPhoneNumberValid(
      phoneNumber.number,
      countryCode
    );

    if (isPhoneNumberValid_) {
      const parsedNumber = PhoneNumber.parsePhoneNumber(phoneNumber.number);
      return parsedNumber.formatInternational();
    }
    return null;
  } catch (error: any) {
    // console.log(error.message);
    return null;
  }
}

export default function PhoneComponent() {
  const [countries, setCountries] = useState<ICountryData[]>([]);
  const [country, setCountry] = useState<ICountryData | null>(null);
  const [showCountries, setShowCountries] = useState(false);
  const [phone, setPhone] = useState<string>("");
  const [formattedPhone, setFormattedPhone] = useState<string>("");

  const phoneInputRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
    },
  });

  const { setValue, setError, clearErrors } = form;

  useEffect(() => {
    if (!showCountries) return;

    const handleOutsideClick = (event: any) => {
      if (
        phoneInputRef.current &&
        !phoneInputRef.current.contains(event.target)
      ) {
        // Clicked outside the phoneInputRef, close the dropdown
        setShowCountries(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener("click", handleOutsideClick);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showCountries]); // Empty dependency array ensures the effect runs once on mount

  useEffect(() => {
    setCountries(getCountryDataList());
  }, []);

  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const response = await axios.get(
          "https://ipinfo.io?token=3ca9e388b8033f"
        );
        const { country } = response.data;
        // console.log(getCountryData(country));
        // console.log(getCountryCode(country));
        // console.log(getCountryDataList());

        setCountry(getCountryData(country));
      } catch (error) {
        console.error("Error fetching user country:", error);
      }
    };

    fetchUserCountry();
  }, []);

  useEffect(() => {
    if (phone) {
      clearErrors("phone");
      var fPhone;
      if (country) {
        const r = formatPhoneNumber(
          phone.toString(),
          country.iso2 as PhoneNumber.CountryCode
        );

        if (r) {
          fPhone = r;
        } else {
          fPhone = `+${country.phone[0]?.toString()} ${phone?.toString()}`;
        }
      }
      const parts = fPhone?.toString()?.split(" ");
      const remainingPart = parts?.slice(1).join(" ");
      if (remainingPart) {
        setFormattedPhone(remainingPart.toString());
        setValue("phone", remainingPart.toString());
      }
    } else {
      setFormattedPhone("");
      setValue("phone", "");
    }
  }, [country, phone, setValue, clearErrors]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!country) return;

    clearErrors();
    const validatePhone = _phone(values.phone, { country: country.iso2 });
    if (!validatePhone.isValid) {
      console.log("validatePhone");
      console.log(validatePhone);

      setError(
        "phone",
        { type: "string", message: "Phone number is invalid" },
        { shouldFocus: true }
      );
      return;
    }

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("validatePhone");
    console.log(validatePhone);

    // console.log(values);

    alert("Phone number is valid ✅");
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative" ref={phoneInputRef}>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Enter Your Phone Number
                  </FormLabel>
                  <div
                    className={`min-w-[300px] flex items-center justify-between gap-3 px-3 border rounded-lg ${
                      showCountries && "rounded-b-none"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="">+{country?.phone[0]}</div>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          className="border-transparent border-none focus-visible:ring-transparent focus-visible:ring-offset-transparent"
                          value={formattedPhone}
                          onChange={(e) => {
                            // const dsd = new PhoneNumber.AsYouType(
                            //   country?.iso2 as PhoneNumber.CountryCode
                            // ).input(e.target.value);
                            // console.log("dsd");
                            // console.log(dsd);

                            const inputWithoutSpaces = e.target.value.replace(
                              /\s/g,
                              ""
                            );
                            if (isNaN(Number(inputWithoutSpaces))) return;
                            setPhone(inputWithoutSpaces);
                          }}
                        />
                      </FormControl>
                    </div>
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => {
                        clearErrors("phone");
                        setShowCountries(!showCountries);
                      }}
                    >
                      <div className="">
                        {country && getEmojiFlag(country.iso2)}
                      </div>
                      <div className="">
                        <RxCaretSort
                          className={`${
                            showCountries ? "opacity-100" : "opacity-50"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div
              className={`${
                !showCountries && "opacity-0 pointer-events-none h-0 w-0"
              } transition-all duration-300 absolute top-full left-0 w-full h-[150px] overflow-auto bg-white border border-t-0 rounded-b-lg py-2 px-2 flex flex-col gap-2`}
            >
              {countries
                .sort((a, b) => {
                  const countryA = a.name.toUpperCase();
                  const countryB = b.name.toUpperCase();

                  if (countryA < countryB) {
                    return -1;
                  }
                  if (countryA > countryB) {
                    return 1;
                  }

                  return 0;
                })
                .map((country) => {
                  return (
                    <div
                      key={`country_${country.name}`}
                      className={`hover:bg-slate-100 rounded-md py-2 px-3 flex items-center justify-between text-sm cursor-pointer`}
                      onClick={() => {
                        setCountry(country);
                        setShowCountries(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {getEmojiFlag(country.iso2)}
                        <div className="">{country.name}</div>
                      </div>
                      <div className="">+{country.phone[0]}</div>
                    </div>
                  );
                })}
            </div>
          </div>

          <Button type="submit" className="w-full mt-1">
            Subscribe
          </Button>
        </form>
      </Form>
    </div>
  );
}
