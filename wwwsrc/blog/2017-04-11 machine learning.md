---
title: Risks of Opaque Machine Learning
date: 2017-04-11
---

Many science fiction writers have written about how an AI can go rogue, typically in self-preservation.  Stories like Terminator or The Matrix.  Fortunately today, there is very little risk of an AI taking over the world, but there are ethical dilemmas that need to be considered when we work with Machine Learning.

Especially when the influence of individual factors is difficult to understand, the output of machine learning systems can be obtuse.  **Do you think Facebook can tell you *exactly* why they showed you an ad for shampoo?  Do you think [high-frequency trading](https://en.wikipedia.org/wiki/High-frequency_trading#May_6.2C_2010_Flash_Crash) agencies have *full* understanding of their systems?**

## Case 1: Vehicle Emissions

### Backgorund: VW NOx scandal

As you are likely aware, in 2015, [Volkswagen was accused of cheating](https://en.wikipedia.org/wiki/Volkswagen_emissions_scandal) on its emissions tests.  Cars were found to behave differently in real-world conditions than when they were undergoing the EPA test regimen.  The EPA fined Volkswagen for about $18 Billion.  VW stuck with the story that a "rogue engineer" was responsible for this issue.

> When he and his co-conspirators realized that they could not design a diesel engine that would meet the stricter US emissions standards, they designed and implemented [the defeat device] software [[link]](https://www.justice.gov/opa/pr/volkswagen-engineer-pleads-guilty-his-role-conspiracy-cheat-us-emissions-tests)

Now, emissions software is actually a very likely candidate for machine learning optimizations.  Many parameters can be tweaked and optimized to reduce diesel particulates to meet emissions standards.  That standard, however, is a well-known test.

Let's look at an example, with a very simplified system, to show how a solution like the "rogue engineer" created might also arise with an "rogue" machine learning system.

### The Contrived Example

*This is egregiously simplified, but will demonstrate the concept.*

Let's set up a scenario where some engineers are designing an engine system for a diesel car.  They will put [an EGR filter](https://en.wikipedia.org/wiki/Exhaust_gas_recirculation) on the car to help it produce fewer NOx emissions.  They use many complex equations to model the system.  Let's mention a few facts that will be put into their model:

* **As the EGR filter is used more, the worse the engine performance will be, but the car will produce less NOx, which the EPA tests for.**
* **The EPA tests for NOx at 2000 and 3000 RPM**
* As the engine speed increases, the more fuel it will use
* As the engine gets cooler, it operates less efficiently
* (many more)

Next, a machine learning algorithm is thrown at the model, with these goals in mind:

* **Pass the EPA test**
* **Ensure high engine output power**
* **Optimize for fuel economy**
* keep the engine running
* keep the engine at a certain temperature
* (many more)

Now, what do you think the exhaust gas recirculation rate will look like as a function of engine speed?  The curve may look something like this:

![it goes up at s=2000 and s=3000](/img/rs.svg)

Now, is the algorithm immoral?  Is it "cheating"?

What if the engineers didn't actually *see* this plot, but just saw an obtuse set of constants in their code?

---

The point made above is that a machine learning system can generate behavior that might be considered immoral or "cheating" if it was intentionally designed by a person.

## Case 2: Jim's Flight

*Note: this is based on a scenario I saw in a comment on [Hacker News](https://news.ycombinator.com), but I can't find it anymore.*

Let's imagine a man named Jim in the not-so-distant future.  Here are a couple of facts about Jim:

* He is flying out to a conference today, somewhere far away, during the busy travel season
* He doesn't like flying
* He likes to drink
* He booked the flight just three days in advance

Let's also imagine in this scenario that the airline he is flying on has revolutionized their customer service.  They now offer personalized coupons, reminders, and notices delivered to your phone, based on advanced deep learning techniques.  The airline's system looks at your Facebook likes to offer you special deals and coupons in the terminal. They even recognize your face to allow you to skip showing your boarding pass at various places, and can bill you for your food / souvenir purchases in the airport by recognizing your face.

Now, let's say Jim arrives at the terminal with about 15 minutes to spare.  He is not looking forward to his 6-hour flight, and he heads over to the airport bar to grab a quick drink.  

The system at the bar conveniently recognizes his face as he sits down,  verifies he is of age, and bills him for his first drink without him even opening his wallet.  After he sits for what feels like 5 minutes with his drink, his phone buzzes and offers him a coupon for another drink at half price.  He accepts the offer and presents the coupon to the waiter and sips his second drink.

As Jim finishes his drink, he checks the time, and rushes to the terminal to board his plane.  Unfortunately, he is too late, and the doors to the plane are already closed.  The airline does not offer him a refund, because he was not on time to the doors.  Unbeknownst to Jim, every seat on the plane was taken.  

Jim blames himself for missing his flight.  He is able to find a flight that leaves 2 hours later, and buys another ticket.

---

In hindsight, why did the system offer him a discounted drink?  Why didn't it send him a reminder to board his plane when he still had time?  

Machine learning algorithms have the ability to optimize for patterns that may not be obvious to humans working on the same problem.  They can develop new strategies.  In this case, the algorithm may have weighed a few facts, and acted in the airline's best interests:

| Data | Source |
| ---  | --     |
| Jim was at the bar| recognized with camera |
| Jim likes to drink, and doesn't like flying | Jim's Facebook posts |
| Jim isn't very punctual | Jim booked his flight late |
| The flight is overbooked | Airline database |
| The airline will need to offer passengers vouchers or cash to "bump" them to a later flight | policy/regulation |

---

The cost of forcing Jim to take another flight would have cost *hundreds* of times more than a drink coupon.  If the algorithm is optimizing for money, maximizing passenger throughput, and selling more products, this is one possible scenario.

Now again, is this behavior immoral?  **More importantly, how would anyone have known this behavior emerged at all?**  

## Case 3: Predatory Lending

This one will be brief, because I'm assuming you get the idea by now.

If a *person* chooses to give a 30-year, extremely high rate mortgage to somebody with absolutely terrible credit, it is [predatory](https://en.wikipedia.org/wiki/Predatory_lending).  But if an algorithm does it, what is it?  Is it wrong?  Is it illegal?  Who goes to jail?
