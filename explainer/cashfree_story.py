from manim import *

INK = "#2A3BD6"
PAPER = "#FFFEFB"
CORAL = "#FF9D7A"
YELLOW = "#FFE6A3"
MINT = "#D8EECB"


class CashfreeStory(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        # --- beat 1: setup ---
        setup_text = Text("Checking a payment used to take hours.", font_size=32, color=INK).to_edge(UP, buff=1.0)

        card = RoundedRectangle(width=2.2, height=1.4, corner_radius=0.15, color=INK, stroke_width=4).shift(LEFT * 3)
        card_label = Text("payment", font_size=22, color=INK).next_to(card, DOWN, buff=0.25)

        clock = Circle(radius=0.75, color=INK, stroke_width=4).shift(RIGHT * 3)
        hand_min = Line(clock.get_center(), clock.get_center() + UP * 0.55, color=INK, stroke_width=4)
        hand_hr = Line(clock.get_center(), clock.get_center() + RIGHT * 0.32, color=INK, stroke_width=4)
        clock_label = Text("5-6 hours", font_size=22, color=INK).next_to(clock, DOWN, buff=0.25)

        self.play(Write(setup_text))
        self.play(Create(card), FadeIn(card_label))
        self.play(Create(clock), Create(hand_min), Create(hand_hr), FadeIn(clock_label))
        self.wait(0.5)
        self.play(Rotate(hand_min, angle=4 * PI, about_point=clock.get_center(), run_time=2, rate_func=linear))
        self.wait(0.3)
        self.play(FadeOut(VGroup(setup_text, card, card_label, clock, hand_min, hand_hr, clock_label)))

        # --- beat 2: turn ---
        turn_text = Text("I built something that checks it the moment it happens.", font_size=30, color=INK).to_edge(UP, buff=1.0)
        pipe = Line(LEFT * 4.2, RIGHT * 4.2, color=INK, stroke_width=6)
        dot = Dot(color=CORAL, radius=0.16).move_to(LEFT * 4.2)
        check = Text("✓", font_size=56, color=MINT).move_to(RIGHT * 4.2)

        self.play(Write(turn_text))
        self.play(Create(pipe))
        self.play(FadeIn(dot))
        self.play(MoveAlongPath(dot, Line(LEFT * 4.2, RIGHT * 4.2)), run_time=1.1, rate_func=linear)
        self.play(FadeOut(dot), FadeIn(check))
        self.wait(0.6)
        self.play(FadeOut(VGroup(turn_text, pipe, check)))

        # --- beat 3: payoff ---
        payoff_text = Text("What took hours now takes seconds.", font_size=32, color=INK).to_edge(UP, buff=1.0)
        hours = Text("5-6 HOURS", font_size=58, color=INK, weight=BOLD)
        seconds = Text("SECONDS", font_size=58, color=CORAL, weight=BOLD)

        self.play(Write(payoff_text))
        self.play(FadeIn(hours, scale=0.8))
        self.wait(0.5)
        self.play(ReplacementTransform(hours, seconds))
        self.play(Circumscribe(seconds, color=YELLOW, stroke_width=4))
        self.wait(1.2)
