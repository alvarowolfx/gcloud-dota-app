import 'package:flutter/material.dart';

import 'package:dota_app/pages/heroes_page.dart';

void main() => runApp(DotaApp());

class DotaApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Dota App',
      theme: ThemeData(
        primarySwatch: Colors.red,
      ),
      home: HeroesPage(title: 'Heroes'),
    );
  }
}
